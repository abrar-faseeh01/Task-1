import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Hashing happens here (not a schema pre-save hook) so an unrelated
    // profile update can never accidentally re-hash the password.
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // role is never passed from dto — always defaults to 'user' in UsersService.
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
    });

    return user; // passwordHash stripped automatically via schema's toJSON
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    // Same generic error whether the user doesn't exist or the password
    // is wrong — prevents attackers from enumerating valid emails.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
  async updateCredentials(userId: string, dto: UpdateCredentialsDto) {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (!dto.newEmail && !dto.newPassword) {
      throw new BadRequestException('Provide newEmail and/or newPassword');
    }

    // Only admins may change their email — regular users can only change their password.
    if (dto.newEmail && user.role !== 'admin') {
      throw new ForbiddenException('Only admins can change their email');
    }

    if (dto.newEmail && dto.newEmail.toLowerCase() !== user.email) {
      const existing = await this.usersService.findByEmail(dto.newEmail);

      if (existing) {
        throw new ConflictException('Email already in use');
      }

      user.email = dto.newEmail.toLowerCase();
    }

    if (dto.newPassword) {
      user.passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    }

    await user.save();

    // Create a fresh JWT containing the updated email and existing role.
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
