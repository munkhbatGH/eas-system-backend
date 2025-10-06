import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { HrService } from './hr.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/decorator/user.decorator';

@Controller('hr')
export class HrController {
  constructor(
    private readonly hrService: HrService,
) {}

  @UseGuards(AuthGuard)
  @Post('/organization')
  async post(@Request() req, @User() user): Promise<any | undefined> {
    return await this.hrService.organizationSave(user, req.body)
  }
  
}
