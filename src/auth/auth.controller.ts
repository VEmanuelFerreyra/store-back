import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { Roles } from './decorators/roles.decorator';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('signin')
  login(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
