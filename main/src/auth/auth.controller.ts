import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from './decorator/user.decorator';
import { Public } from './decorator/public.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Request() req, @Body() loginDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    console.log('--------login--');
    return this.authService.login(req, res, loginDto.username, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('--------profile--');
    return req.user;
  }

  @Public()
  @Get('user')
  test(@Request() req, @User() user) {
    console.log('--------user--', user);
    return user;
  }
}