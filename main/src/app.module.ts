import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { controllers } from './controllers';
import { services } from './services';
import { modules } from './modules';
import { DatabaseModule } from './database/database.module';
import { SettingsModule } from './settings/settings.module';
import { QraphqlClient } from './thirdparty/graphql/graphql.provider';
import { KafkaModule } from './thirdparty/kafka/kafka.module';

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
    SettingsModule,
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
