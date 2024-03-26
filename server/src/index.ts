import express, { Request, Response } from 'express';
import router from './routes/interview.route';
import mongoose, { ConnectOptions } from 'mongoose';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

async function startServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/placeprep_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    
    console.log('Connected to database');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error connecting to database: ', error);
    process.exit(1); // Exit the process if unable to connect to the database
  }
}

startServer();

app.use('/interview', router);
