import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateUserDto } from 'src/dtos/UserDto';
import { Public } from 'src/modules/auth/decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getList(@Request() req) {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.save(createUserDto);
  }
  
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.save(createUserDto);
  }
}
