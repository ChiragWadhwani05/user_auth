import { config } from 'dotenv';
config({ path: '.env' });
import connectToDatabase from './db/db';
import app, { startApp } from './app';

const port = process.env.PORT || 3000;

async function startServer(app: any) {
  try {
    await connectToDatabase();
    startApp(app);
    app.listen(port, () => {
      console.log('\n⚙️  Server is running on port:', port);
    });
  } catch (error) {
    console.error(error);
  }
}
startServer(app);
export default startServer;
