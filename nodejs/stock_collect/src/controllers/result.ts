import { Request, Response } from 'express';
import { Singleton } from '../singleton.js';

//to-do delete function
export default async function result(req: Request, res: Response) {
    try {
        const stocks = []; //Singleton.getInstance().getCategories();
       //Singleton.getInstance().setStocks([]);
     
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