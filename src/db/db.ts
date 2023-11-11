import { Sequelize } from 'sequelize';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env as {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
});

async function connectToDatabase(): Promise<void> {
  try {
    // So that every table can be created if doesn't exists
    await sequelize.sync();

    console.log(`\n📤 ${DB_NAME} Database connected`);
  } catch (error: any) {
    console.error(`\nFailed to connect to the ${DB_NAME} database:`, error);

    // Terminate Nodejs so that the execution stops
    process.exit(1);
  }
}

export { sequelize };
export default connectToDatabase;
