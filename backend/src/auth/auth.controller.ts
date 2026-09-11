import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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
    return { success: true, data: { email: user.email, role: user.role } };
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

    return { success: true, data: { email: user.email, role: user.role } };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true, data: null };
  }

  @Get('me')
  me(@CurrentUser() user: { userId: string; email: string; role: string }) {
    return { success: true, data: { email: user.email, role: user.role } };
  }
  // Temporary route to test role-based authorization
  @Roles('admin')
  @Get('admin-check')
  adminCheck() {
    return { success: true, data: 'you are admin' };
  }
}
