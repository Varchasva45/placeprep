import express, { Request, Response } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { questionRouter } from './routes/question.route';
import { interviewRouter }  from './routes/interview.route';
import dotenv from 'dotenv';


dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
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
app.use('/interview', interviewRouter);
app.use('/question', questionRouter);
