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
      useFactory: async (configService: ConfigService) => {
        const user = configService.get<string>('DB_USER');
        const pass = encodeURIComponent(configService.get<string>('DB_PASS') ?? '');
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<string>('DB_PORT');
        const db   = configService.get<string>('DB_NAME');
        return {
          uri: `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=${db}`,
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => console.log('connected'));
            connection.on('open', () => console.log('open'));
            connection.on('disconnected', () => console.log('disconnected'));
            connection.on('reconnected', () => console.log('reconnected'));
            connection.on('disconnecting', () => console.log('disconnecting'));
            return connection;
          },
        };
      },
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