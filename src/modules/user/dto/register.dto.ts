import { IsNotEmpty, IsEmail, MinLength } from "class-validator"

export default class RegisterDto{
  @IsNotEmpty()
  public first_name: string | undefined

  @IsNotEmpty()
  public last_name: string | undefined

  @IsNotEmpty()
  @IsEmail()
  public email: string | undefined
  
  @IsNotEmpty()
  @MinLength(6,{message:"password is too short"})
  public password: string | undefined
}