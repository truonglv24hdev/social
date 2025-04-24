import { IsString } from "class-validator";

export default class CreatePostDto {
  @IsString()
  public text: string | undefined;
}