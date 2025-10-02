import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { DynamicModelService } from 'src/dynamic-model/dynamic-model.service';
import { User } from 'src/schemas/user.schema';
import { hashString } from 'src/utils/bcrypt';

const modelName = 'User'

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    private dynamicModelService: DynamicModelService,
  ) {}

  async findOneId(id: any): Promise<any> {
    return await this.dynamicModelService.findOne(modelName, { _id: new ObjectId(id) })
  }

  async findOne(username: string): Promise<any> {
    return await this.dynamicModelService.findOne(modelName, { name: username.toString() })
  }

  async findAll(): Promise<any[]> {
    // return await this.connection.collection('users').find().toArray();
    return await this.dynamicModelService.findAll(modelName, {})
  }

  async save(user): Promise<User | undefined> {
    try {
      const found = await this.dynamicModelService.findOne(modelName, { name: user.name })
      if (found) {
        throw new BadRequestException('Өмнө бүртгэгдсэн хэрэглэгч байна.');
      }
      user.password = await hashString(user.password);
      return await this.dynamicModelService.save(modelName, user, null)
    } catch (error) {
      console.log('---error---', error);
      return undefined;
    }
  }

}