import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  private readonly logger = new Logger(TestConsumer.name);

  constructor(private readonly consumerService: KafkaConsumerService) {}

  async onModuleInit() {
    this.logger.log('Starting Kafka consumer for test-topic...');
    await this.consumerService.consume(
        { topics: ['test-topic'], fromBeginning: true },
        {
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString() ?? null;
                this.logger.log(`Received message on ${topic} partition ${partition}: ${value}`);
            },
        }
    );
  }
}