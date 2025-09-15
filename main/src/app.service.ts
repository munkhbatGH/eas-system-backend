import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from './kafka/kafka.producer.service';

@Injectable()
export class AppService {

  constructor(private readonly producerService: KafkaProducerService){}

  async getHello(): Promise<string> {

    // Sending message by creating topic with message 
    await this.producerService.produce({
      topic: 'test-topic',
      // topic: 'user-created',
      messages:[{
        value:'Hello world'
      }]
    })

    return 'Hello World!';
  }
}
