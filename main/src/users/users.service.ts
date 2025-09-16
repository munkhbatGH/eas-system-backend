import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { hashString } from 'src/utils/bcrypt';

export type UserTemp = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
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

  async save(user): Promise<User> {
    const found = await this.connection.collection('users').findOne({ name: user.name });
    if (found) {
      throw new BadRequestException('Өмнө бүртгэгдсэн хэрэглэгч байна.');
    }
    user.password = await hashString(user.password);
    console.log('---user---', user)
    const user_new = new User(user);
    await user_new.save()
    return user_new;
  }

}