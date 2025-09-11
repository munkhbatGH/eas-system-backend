import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from './decorator/user.decorator';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('--------login--');
    return this.authService.signIn(signInDto.username, signInDto.password);
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