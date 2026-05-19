import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'example@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    description:
      "User's password should be 8 characters(with at least one special character, one number, Upper and lower case letters",
    example: 'Africa@01',
  })
  @IsString()
  password!: string;
}
