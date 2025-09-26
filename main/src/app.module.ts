import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { controllers } from './controllers';
import { services } from './services';
import { modules } from './modules';
import { KafkaModule } from './kafka/kafka.module';
import { QraphqlClient } from './graphql/graphql.provider';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env-production',,
      envFilePath: '.env-development',
      load: [configuration],
    }),
    ...modules,

    KafkaModule,
    QraphqlClient,
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
