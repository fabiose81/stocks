import { ProducerFactory } from '../kafka/producerFactory.js';
import OpenAI from 'openai';

export class GptClient {
    
    openAiClient: OpenAI

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        this.openAiClient = new OpenAI({ apiKey });
    }
   
   async search() {
        const model = process.env.CHAT_GPT_MODEL;
        const content = process.env.CHAT_GPT_MESSAGE_CONTENT;

        const completion = await this.openAiClient.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: content
                },
            ],
        });
        
        const stockCode = completion.choices[0].message.content;
        const producer = new ProducerFactory();
        producer.send(stockCode);
    }
}