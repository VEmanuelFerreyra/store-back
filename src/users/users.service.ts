import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    // Verifico si el email ya está registrado
    const emailExist = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (emailExist) throw new ConflictException('Email is already registered');

    // Verifico si las contraseñas coinciden
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    // Creo el objeto usuario
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Verifico si el usuario existe
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
  
    // Verifico si el email a actualizar ya está registrado por otro usuario
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email is already registered by another user');
      }
    }
  
    // Actualizo el usuario con los nuevos datos
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    // Verifico si el usuario existe
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Elimino el usuario
    await this.usersRepository.remove(user);
    return { message: `User with ID ${id} removed successfully` };
  }
}
