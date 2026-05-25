import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class AppleAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsString()
  displayName: string;
}
