import { IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
                             
    @IsString()
    @MinLength(1, { message: 'The name cannot be empty' })
    @MaxLength(250, { message: 'The name cannot exceed 250 characters' })
    @IsNotEmpty()
    name:string;

    @IsString()
    @MinLength(1)
    @MaxLength(500, { message: 'The description cannot exceed 500 characters' })
    description:string;

    @IsNumber()
    @IsNotEmpty()
    @Max(1000000, { message: 'The price must not exceed 1000000' })
    @Min(1, { message: 'The price must be at least 1.00' })
    price:number;

    @IsInt()
    @Min(0, { message: 'The quantity cannot be less than 0' })
    @Max(100000, { message: 'The amount cannot be greater than 100000' } )
    quantity: number;

    @IsString()
    @MinLength(1)
    @MaxLength(500, { message: 'The image Url cannot exceed 500 characters' })
    imageUrl: string;

    @IsInt()
    @IsNotEmpty()
    category: number;
}
