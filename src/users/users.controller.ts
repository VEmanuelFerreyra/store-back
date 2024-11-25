import { Controller, Get, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

interface RequestWithUser extends Request{
  user: {
    email: string,
    role: string
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Auth(Role.ADMIN)
  profile(@Req() req: RequestWithUser) {
    return this.usersService.profile(req.user);
  }

  @Get()
  findAll() {
    const users = this.usersService.findAll();
    return plainToInstance(User, users);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
