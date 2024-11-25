import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { loginAuthDto } from 'src/auth/dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async login({ email, password }: loginAuthDto) {
    //verifico si el email existe
    const userExist = await this.usersRepository.findOne({ where: { email }});
    if (!userExist) throw new UnauthorizedException('Incorrect email or password');

    //valido la contraseña
    const validPassword = await bcryptjs.compare(password, userExist.password)
    if(!validPassword){
      throw new UnauthorizedException('Incorrect email or password');
    }

    const payload = { email: userExist.email, role: userExist.role }

    const token = await this.jwtService.signAsync(payload);

    return {token, email};
  }

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

    //hash de password
    const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);

    // Creo el objeto usuario
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

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

  async profile({email, role}: {email:string, role: string}){
    return await this.usersRepository.findOneBy({email});
  }
}
