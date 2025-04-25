import express from 'express';
import cors from 'cors';
import logger from 'morgan';


const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend' });
    });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});