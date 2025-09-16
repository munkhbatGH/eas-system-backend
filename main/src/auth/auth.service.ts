import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareWithHashString } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService
    ) {}

  async login(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const compared = await compareWithHashString(pass, user.password);
    if (!compared) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}