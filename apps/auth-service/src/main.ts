import express from 'express';
import cors from 'cors'
import { errorMiddleware } from '../../../packages/error-handler/error-middleware'
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello 2'});
});

app.use(errorMiddleware)

const port = process.env.PORT || 6001

const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`)
});

server.on('error', (err) => {
    console.error('Server error:', err)
})
