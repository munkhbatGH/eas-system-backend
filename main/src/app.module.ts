import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from './schemas';
import { controllers } from './controllers';
import { services } from './services';
import { modules } from './modules';
import { databaseConfig } from './database-config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ...databaseConfig,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env-production',,
      envFilePath: '.env-development',
      load: [configuration],
    }),
    MongooseModule.forFeature(Schemas),
    ...modules,
    KafkaModule,
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
