import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Includes passwordHash — for AuthService's internal use only (login compare).
  findByEmailWithPassword(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash')
      .exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  // Includes passwordHash — needed to verify currentPassword before a credentials change.
  findByIdWithPassword(id: string) {
    return this.userModel.findById(id).select('+passwordHash').exec();
  }

  // AuthService.signup() will always call this without `role`,
  // so it defaults to 'user' — role is never client-controlled.
  create(data: { email: string; passwordHash: string; role?: UserRole }) {
    return this.userModel.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role ?? 'user',
    });
  }
}
