import express, { Request, Response } from 'express';
import router from './routes/interview.route';


const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/interview', router);

