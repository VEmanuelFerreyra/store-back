import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { loginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    //private readonly jwtService: JwtService
  ){}

  async create(createAuthDto: CreateAuthDto){
    return await this.usersService.create(createAuthDto);
  }

  async login(loginAuthDto: loginAuthDto){
    return await this.usersService.login(loginAuthDto);
  }
}
