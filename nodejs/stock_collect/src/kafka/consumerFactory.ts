import { Consumer } from 'kafkajs'
import { ConfigKafka } from './configKafka.js';

export class ConsumerFactory {

    consumer : Consumer;

    constructor() {
        const kafka = new ConfigKafka().getKafkaConnection();
        this.consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID })
    }

    async run() {     
        let fromBeginning = (/true/i).test(process.env.KAFKA_SUBSCRIBE_FROM_BEGINNING)

        await this.consumer.connect()
        await this.consumer.subscribe({ topic: process.env.KAFKA_TOPIC_CONSUMER, fromBeginning: fromBeginning })
        
        await this.consumer.run({
          eachMessage: async ({ message }) => {
            console.log({
              value: message.key.toString(),
            })
            console.log({
              value: message.value.toString(),
            })
          },
        })
    }
}