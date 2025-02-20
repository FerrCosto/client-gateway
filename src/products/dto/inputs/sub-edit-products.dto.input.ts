import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { StateImage } from 'src/products/enums/state-image.enum';
@InputType()
export class ImgProductsEditInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Id de la imagen del producto a modificar',
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number;
  @Field(() => String, {
    nullable: true,
    description: 'Url de la imagen del producto ',
  })
  @IsString()
  @IsOptional()
  url?: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripción para la imagen si llegara a tener',
  })
  @IsString()
  @IsOptional()
  alt?: string;
  @Field(() => StateImage, {
    nullable: true,
    description: 'El estado de la imagen',
  })
  @IsEnum(() => StateImage)
  @IsOptional()
  state_image?: StateImage;
  @Field(() => Boolean, {
    nullable: true,
    description: 'Si se desea es eliminar la imagen',
  })
  @IsBoolean()
  @IsOptional()
  delete?: boolean = false;
}
