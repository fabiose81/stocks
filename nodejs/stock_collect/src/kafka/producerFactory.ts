import { Producer } from 'kafkajs'
import { ConfigKafka } from './configKafka.js';

export class ProducerFactory {

    producer : Producer;
        
    constructor() {
        const kafka = new ConfigKafka().getKafkaConnection();
        this.producer = kafka.producer()        
    }

    async send(stock: string) {
        await this.producer.connect()
        try {
            const response = await this.producer.send({
                topic: process.env.KAFKA_TOPIC_PRODUCER,
                messages: [
                    { value: stock },
                ],
            })
            console.log('Published message', { response })
        } catch (error) {
            console.error('Error publishing message', error)
        }
    }
}