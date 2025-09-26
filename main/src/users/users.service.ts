import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { hashString } from 'src/utils/bcrypt';

export type UserTemp = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
  ) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
  ];

  // async findOne(username: string): Promise<UserTemp | undefined> {
  //   return this.users.find(user => user.username === username)
  // }

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
      const user_new = new this.userModel(user);
      await user_new.save()
      return user_new;
    } catch (error) {
      console.log('---error---', error);
      return undefined;
    }
  }

}