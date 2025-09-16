import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBasicAuth } from '@nestjs/swagger';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ApiBasicAuth()
  @Public()
  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello()
  }
}
