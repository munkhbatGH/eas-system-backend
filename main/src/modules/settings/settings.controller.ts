import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { User } from 'src/modules/auth/decorator/user.decorator';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
) {}
  
  @UseGuards(AuthGuard)
  @Get('menu-list')
  getMenuList(@User() user) {
    return this.settingsService.getMenuList(user);
  }
}
