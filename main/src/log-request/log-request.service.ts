
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogRequest, LogRequestDocument } from 'src/schemas/logRequest';

@Injectable()
export class LogRequestService {
  constructor(
    @InjectModel(LogRequest.name)
    private readonly logRequestModel: Model<LogRequestDocument>, // ✅ Inject here
  ) {}

  async saveLog(user: any, body: any) {
    try {
      body.createdUserId = user._id
      await this.logRequestModel.create(body);
    } catch (error) {
      console.log('---Error -> log-request -> saveLog---', error);
      throw error
    }
  }
}
