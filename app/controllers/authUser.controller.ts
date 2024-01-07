import db from '../models';
import { Request, Response } from 'express';
import * as crypto from 'crypto';


const uuid = require('uuid');
const saltRounds = 10; // You can adjust the number of salt rounds as needed
const emailValidator = require('email-validator');

const { Sequelize, DataTypes } = require('sequelize');
const util = require('util');

const user = db.users;
const session = db.sessions;



export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {

    const users = await user.findAll();
    console.log(users);
    res.json(users);

  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const signup = async (req: Request, res: Response): Promise<void> => {

  try {
    const newUser = req.body;

    // Validate required fields
    if (!newUser.email || !newUser.password) {
      res.status(400).json({ error: 'There are  required filed was missed ' });
      return;
    }

    if (!emailValidator.validate(newUser.email)) {
      console.log(`${newUser.email} is not valid email address.`);
      res.status(500).json({ error: `${newUser.email} is not valid email address.` });
      return;
    }

    // const salt = crypto.randomBytes(16).toString('hex');
    // const hashedPassword = await hashPassword(newUser.password, salt);
    const hashedPassword = hashPassword(newUser.password);

    const users = await user.create({ email: newUser.email, password: hashedPassword });

    if (!users) {

      res.status(500).json({ error: 'error when create new user' });
    }
    res.status(201).json(users);

  } catch (error) {

    console.error('Error creating users:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
};




export const signin = async (req: Request, res: Response): Promise<void> => {

  try {
    const users = req.body;

    if (!users.email || !users.password) {
      res.status(400).json({ error: 'There are  required filed was missed ' });
      return;
    }


    const checkUser = await user.findOne({
      where: { email: users.email }
    });

    if (!checkUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }


    const passwordMatch = comparePasswords(users.password, checkUser.password);

    if (passwordMatch) {
      console.log("Login successful with hash password");
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }


    const token = generateSessionToken();

    const newSession = await session.create({ session: token, user_id: checkUser.id });

    console.log("user, session signin are exist");


    res.status(201).json({ token });


  } catch (error) {
    console.error('Error fetching signin :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}



export const logout = async (req: Request, res: Response): Promise<void> => {

  try {
    const sessionFromHeader = req.get('session');

    const deletedSession = await session.destroy({
      where: { session: sessionFromHeader },
    });
    res.status(201).json("session delete done  ");//to do : inside obj


  } catch (error) {
    console.error('Error fetching logout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}


export const changePassword = async (req: Request, res: Response): Promise<void> => {

  try {
    const users = req.body;
    const cuuUser = await user.findOne({
      where: { email: users.email }
    });
    if (!cuuUser) {
      res.status(404).json({ error: 'User not exist ' });
    }

    //change passwrod
    const hashedPassword = hashPassword(users.password);
    users.password = hashedPassword;
    const userChangePassword = await user.update({ email: users.email, password: users.password }, {
      where: { email: users.email }
    });

    if (!userChangePassword) {
      res.status(404).json({ error: 'error when change password ' });
    }

    //logout from all sessions

    const deletedAllSession = await session.destroy({
      where: { user_id: cuuUser.id }
    });
    if (!deletedAllSession) {
      res.status(404).json({ error: 'There are not session to delete' });

    }


    res.status(201).json("change passwrord and delete all session  done  ");


  } catch (error) {
    console.error('Error fetching change pass:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}


function hashPassword(password: string): string {
  const salt: string = crypto.randomBytes(8).toString('hex');
  const hash: string = crypto.pbkdf2Sync(password, salt, 500, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function comparePasswords(inputPassword: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    // Handle the case where storedHash is undefined or doesn't have the expected format
    return false;
  }

  const [salt, hash] = storedHash.split(':');
  const inputHash: string = crypto.pbkdf2Sync(inputPassword, salt, 500, 64, 'sha256').toString('hex');
  return inputHash === hash;
}

//change it tithout salt
function generateSessionToken(): string {
  // Generate a random session ID
  const sessionId: string = crypto.randomBytes(16).toString('hex');

  // Generate a random salt for additional security
  const salt: string = crypto.randomBytes(16).toString('hex');

  // Combine the session ID and salt
  const combinedData: string = `${sessionId}:${salt}`;

  // Create a SHA-256 hash of the combined data
  const token: string = crypto.createHash('sha256').update(combinedData).digest('hex');
  return token;
}
