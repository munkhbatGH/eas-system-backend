import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareWithHashString } from 'src/utils/bcrypt';

import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from 'src/schemas/device.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      @InjectModel(Device.name)
      private readonly deviceModel: Model<DeviceDocument>, // ✅ Inject here
    ) {}

  async login(req, res, username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      const compared = await compareWithHashString(pass, user.password);
      if (!compared) {
        throw new BadRequestException("User not found");
      }
  
      // check device
      const device_result: any = await this.checkDevice(req, res, user)
      if (device_result?.warning) {
        throw new BadRequestException(device_result.warning);
      }
  
      const payload = { sub: user._id, name: user.name };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }


  //#region CHECK DEVICE

  async getFingerprintFromRequest(req) {
    const ua = req.headers['user-agent'] || '';
    const tz = req.headers['accept-language'] || '';
    const screen = req.body.screen || ''; // client-side JS can send resolution
    const raw = `${ua}|${tz}|${screen}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }
  async checkDevice(req, res, user) {
    let deviceToken = req.cookies?.deviceToken;
    if (!deviceToken) {
      deviceToken = uuidv4();
      // set cookie (httpOnly, secure, sameSite)
      res.cookie('deviceToken', deviceToken, {
        httpOnly: true, secure: true,
        sameSite: 'lax', // none, lax
        // maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }
  
    const fingerprint = await this.getFingerprintFromRequest(req);
    const ip = req.ip || req.socket.remoteAddress;

    let device = await this.deviceModel.findOne({ deviceToken: deviceToken.toString() });

    if (device && device.userId.toString() !== user._id.toString()) {
      return { warning: 'Энэ төхөөрөмж өмнө нь өөр хэрэглэгчээр нэвтэрсэн байна. Та давхар нэвтрэх боломжгүй.' };
    }

    if (!device) {
      // create
      device = await this.deviceModel.create({
        deviceToken, fingerprint, userAgent: req.headers['user-agent'], ip, userId: user._id, lastUsername: user.username
      });
    } else {
      // update
      device.fingerprint = fingerprint;
      device.lastSeen = new Date();
      device.ip = ip;
      device.userId = user._id;
      await device.save();
    }
    return device
  }

  //#endregion

}