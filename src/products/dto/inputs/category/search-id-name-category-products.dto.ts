import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
@InputType()
export class FindByValueInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Id para buscar la categoria',
  })
  @IsInt()
  @Min(1)
  @IsPositive()
  @IsOptional()
  id?: number;
  @Field(() => String, {
    nullable: true,
    description: 'Nombre para buscar la categoria',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
