import express from 'express';
const app = express();
app.use(express.json());
const port = 3001;

import db from "./app/models";


db.sequelize.sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error:Error) => {
    console.error('Unable to connect to the database:', error);
  });


app.get("/", (req, res) => {
  res.json({ message: "welcom to nodejs app" });
});

import configureBookRoutes from "./app/routes/book.routes";
import configurePublisherRoutes from "./app/routes/publisher.routes";
import configureCommentRoutes from "./app/routes/comment.routes";
import configureAutherRoutes from "./app/routes/authUser.routes";

configureBookRoutes(app);
configurePublisherRoutes(app);
configureCommentRoutes(app);
configureAutherRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});