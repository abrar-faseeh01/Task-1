import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto);
    return { email: user.email, role: user.role };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // local http://localhost — production needs secure:true + sameSite:'none' + HTTPS
      maxAge: 2 * 60 * 60 * 1000, // 2h, matches JWT_EXPIRES_IN
    });

    return { email: user.email, role: user.role };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return null; // ResponseInterceptor wraps this as { success: true, data: null }
  }

  @Get('me')
  me(@CurrentUser() user: { userId: string; email: string; role: string }) {
    return { email: user.email, role: user.role };
  }

  @Patch('me')
  @HttpCode(200)
  async updateMe(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user: updated } =
      await this.authService.updateCredentials(user.userId, dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return { email: updated.email, role: updated.role };
  }

  // Temporary route to test role-based authorization
  @Roles('admin')
  @Get('admin-check')
  adminCheck() {
    return 'you are admin';
  }
}
