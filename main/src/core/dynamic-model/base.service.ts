import { Model } from "mongoose";

export class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: any): Promise<T> {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }
}

// --- EXAMPLE ---
// @Injectable()
// export class UsersService extends BaseService<UserDocument> {
//   constructor(
//     @InjectModel(User.name) userModel: Model<UserDocument>,
//   ) {
//     super(userModel);
//   }

//   // additional methods...
// }