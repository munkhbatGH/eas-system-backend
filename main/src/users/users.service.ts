import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DynamicModelService } from 'src/dynamic-model/dynamic-model.service';
import { User } from 'src/schemas/user.schema';
import { hashString } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    private dynamicModelService: DynamicModelService,
  ) {}

  async findOne(username: string): Promise<any> {
    return await this.connection.collection('users').findOne({ name: username.toString() });
  }

  async findAll(): Promise<any[]> {
    return await this.connection.collection('users').find().toArray();
  }

  async save(user): Promise<User | undefined> {
    try {
      const found = await this.connection.collection('users').findOne({ name: user.name });
      if (found) {
        throw new BadRequestException('Өмнө бүртгэгдсэн хэрэглэгч байна.');
      }
      user.password = await hashString(user.password);
      console.log('---user---', user);

      return await this.dynamicModelService.save('User', user)
    } catch (error) {
      console.log('---error---', error);
      return undefined;
    }
  }

}