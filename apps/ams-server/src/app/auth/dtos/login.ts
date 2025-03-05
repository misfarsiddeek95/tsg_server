import { IsString } from 'class-validator';

export class Login {
  @IsString()
  password: string;

  @IsString()
  username: string;
}
