import { Injectable } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";

@Injectable()
export class KafkaConsumerService {
    private readonly kafkaClient = new Kafka({
        clientId: 'eas-system-producer',
        brokers: ['localhost:9092'], // Update to match your Kafka setup
    });

    private readonly consumers: Consumer[] = [];

    async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {

        const consumer = this.kafkaClient.consumer({ groupId: `eas-system-consumer-${process.pid}` });

        await consumer.connect();
        await consumer.subscribe(topics);
        await consumer.run(config);

        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            console.log('----consumer----', consumer)
            await consumer.disconnect();
        }
    }
}