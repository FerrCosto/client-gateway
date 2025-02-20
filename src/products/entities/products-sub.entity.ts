import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StateImage } from '../enums/state-image.enum';

@ObjectType()
export class ImgProducts {
  @Field(() => ID, { description: 'Id de la imagen relaciona al producto' })
  id: number;
  @Field(() => String, {
    description: 'Url de la imagen relaciona al producto',
  })
  url: string;
  @Field(() => String, {
    nullable: true,
    description: 'Descripción de la imagen relaciona al producto',
  })
  alt?: string;
  @Field(() => StateImage, {
    description: 'Estado de la imagen relaciona al producto',
  })
  state_image: StateImage;
}
