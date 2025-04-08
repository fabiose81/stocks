import { Kafka, KafkaConfig } from 'kafkajs'

export class ConfigKafka {

    getKafkaConnection() {
        const kafkaConfig: KafkaConfig = { brokers: [process.env.KAFKA_BOOTSTRAP_SERVER] }
        const kafka = new Kafka(kafkaConfig)

        return kafka;
    }
}