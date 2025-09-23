import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
// import { Schemas } from './schemas';
import { controllers } from './controllers';
import { services } from './services';
import { modules } from './modules';
import { databaseConfig } from './database-config';
import { KafkaModule } from './kafka/kafka.module';
import { QraphqlClient } from './graphql/graphql.provider';
import { SchemaModule } from './schema/schema.module';
import { getMongooseFeatures } from './schemas/index';

@Module({
  imports: [
    ...databaseConfig,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env-production',,
      envFilePath: '.env-development',
      load: [configuration],
    }),
    // MongooseModule.forFeature(Schemas),
    MongooseModule.forFeature(getMongooseFeatures()),
    ...modules,

    KafkaModule,
    QraphqlClient,
    SchemaModule,
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
