import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateOrganizationDtoSchema } from '../../dtos/hrOrganization.dto'

@Injectable()
export class HrService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  async organizationSave(user: any, body: any) {
    try {
      const parseResult = CreateOrganizationDtoSchema.safeParse(body);
      if (!parseResult.success) {
        const errors = JSON.parse(parseResult.error.message)
        throw new BadRequestException(errors);
      }
      return { success: true }
    } catch(error) {
      throw error
    }
  }
}
