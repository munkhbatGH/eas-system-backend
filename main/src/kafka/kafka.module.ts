import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaController } from './kafka.controller';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaConsumerService } from './kafka.consumer.service';
import { TestConsumer } from './test.consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'eas-system-client',
            brokers: ['localhost:9092'], // update to match your Kafka setup
            retry: {
              retries: 8,
              initialRetryTime: 300,
            },
          },
          consumer: {
            groupId: `eas-system-consumer-${process.pid}`, // Ensure unique group ID for each instance
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaProducerService, KafkaConsumerService, TestConsumer,],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
