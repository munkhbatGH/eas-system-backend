import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { Schemas } from 'src/schemas';

@Global()
@Module({
  imports: [
    // Connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI') + '/' + configService.get<string>('DB_NAME'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('connected'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    // Register Models
    MongooseModule.forFeature(Schemas),
  ],
  exports: [
    MongooseModule,
  ],
})
export class DatabaseModule {}