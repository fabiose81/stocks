import { Request, Response } from 'express';
import { GptClient } from '../chatgpt/gptClient.js';
import StockModel from '../database/model/stock.model.js';


//to-do delete function
export default async function collect(req: Request, res: Response) {
    try {
   
      const result = await StockModel.aggregate([
      {
        $group: {
          _id: null,
          totalNumberOfStocks: { $sum: "$numberOfStocks" }
        }
      }
    ]);

console.log(`result: ${result}`);

    const total = result[0]?.totalNumberOfStocks || 0;
    console.log(`Total price: ${total}`);

        return res.json({
            status: 200,
            message: 'adfafad',
        });     
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
}