import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.auth.validateUser(body.email, body.password);
    return this.auth.login(user);
  }
  @Post('register')
  async register(@Body() body: any) {
    const user = await this.auth.register(body);
    return this.auth.login(user);
  }
}
