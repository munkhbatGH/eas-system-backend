import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { controllers } from './controllers';
import { services } from './services';
import { modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env-production',,
      envFilePath: '.env-development',
      load: [configuration],
    }),
    ...modules
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
