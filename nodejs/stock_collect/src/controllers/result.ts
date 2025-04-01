import { Request, Response } from 'express';
import { Singleton } from '../singleton.js';

export default async function result(req: Request, res: Response) {
    try {
       const stocks = Singleton.getInstance().getStocks();
       Singleton.getInstance().setStocks([]);
     
       return res.json({
            status: 200,
            message: stocks,
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
}