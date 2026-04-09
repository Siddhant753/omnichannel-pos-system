import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRouter from './routes/auth.routes';
import storeRouter from './routes/store.routes';
import productRouter from './routes/product.routes';
import inventoryRouter from './routes/inventory.routes';
import orderRouter from './routes/order.routes';

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'Backend running on port ' + process.env.PORT });
})

app.use('/api/auth', authRouter);
app.use('/api/store', storeRouter);
app.use('/api/product', productRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/orders', orderRouter);

export default app;