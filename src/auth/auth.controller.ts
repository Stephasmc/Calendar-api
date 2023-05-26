import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoSignIn, AuthDtoSignUp } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Post('signin')
  signIn(@Body() data: AuthDtoSignIn) {
    return this.AuthService.signIn(data);
  }

  @Post('signup')
  signUp(@Body() data: AuthDtoSignUp) {
    return this.AuthService.signUp(data);
  }
}
