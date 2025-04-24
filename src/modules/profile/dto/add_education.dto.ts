import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
export default class AddEducationDto{
  @IsOptional()
  @IsString()
  school?: string | undefined;

  @IsOptional()
  @IsString()
  degree?: string | undefined;

  @IsOptional()
  @IsString()
  from?: Date | undefined;

  @IsOptional()
  @IsString()
  to?: Date | undefined;

  @IsOptional()
  @IsBoolean()
  current?: boolean | undefined;

  @IsOptional()
  @IsString()
  description?: string | undefined;
}
