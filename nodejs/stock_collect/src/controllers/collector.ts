import { Request, Response } from 'express';
import { GptClient } from '../chatgpt/gptClient.js';

export default async function collect(req: Request, res: Response) {
    try {
        const gptClient = new GptClient();
        gptClient.search();

        return res.json({
            status: 200,
            message: 'Collecting data...',
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
}