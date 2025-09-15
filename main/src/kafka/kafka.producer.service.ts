import { Injectable } from '@nestjs/common';
import { Kafka, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  
    private readonly kafkaClient = new Kafka({
        // clientId: 'eas-system-producer',
        brokers: ['localhost:9092'], // Update to match your Kafka setup
    });

    private readonly producer = this.kafkaClient.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async produce(record: ProducerRecord) {
        await this.producer.send(record);
    }

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }

}
