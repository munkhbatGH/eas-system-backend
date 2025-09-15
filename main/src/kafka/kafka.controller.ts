import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { USER_CREATED_TOPIC } from './topics';

@Controller('kafka')
export class KafkaController {
  @EventPattern(USER_CREATED_TOPIC)
  handleUserCreated(@Payload() message: any) {
    console.log('Received user-created event:', message.value)
    // TODO: Process the message (e.g., save to DB)
  }

  // Add more handlers as needed
}