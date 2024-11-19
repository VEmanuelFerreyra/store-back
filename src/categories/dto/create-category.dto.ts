import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    name: string;

    
}
