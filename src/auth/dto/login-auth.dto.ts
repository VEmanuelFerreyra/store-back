import { IsEmail, IsString, Matches } from "class-validator";

export class loginAuthDto {
    @IsEmail()
    email:string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Incorrect email or password',
      })
    password:string;
}