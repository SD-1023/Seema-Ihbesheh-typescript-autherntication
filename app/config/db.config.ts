export interface DbConfig {
  host: string;
  user: string;
  password: string;
  DB: string;
  dialect: string;
  define: {
    freezeTableName: boolean;
  };
}


const dbConfig: DbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'seema123.I',
  DB:"authuser",
  dialect: 'mysql',
  define: {
    freezeTableName: true,
  },
};

export default dbConfig;





