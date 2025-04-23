import { IsNotEmpty, IsEmail, MinLength } from "class-validator"

export default class LoginDto{
  @IsNotEmpty()
  @IsEmail()
  public email: string | undefined
  
  @IsNotEmpty()
  @MinLength(6,{message:"password is too short"})
  public password: string | undefined
}