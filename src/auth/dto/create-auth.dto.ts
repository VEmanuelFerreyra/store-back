import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.',
      })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    confirmPassword: string;

    @IsBoolean()
    isAdmin: boolean;
}
