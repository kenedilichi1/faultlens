import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'User Email Address',
    example: 'example@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    description:
      "User's password should be 6 characters(with at least one special character, one number, Upper and lower case letters",
    example: 'Africa@01',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    type: String,
    description: 'User  Full Name',
    example: 'John Doe',
  })
  @IsString()
  name!: string;
}
