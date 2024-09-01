import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StateImage } from '../enums/state-image.enum';

@ObjectType()
export class ImgProducts {
  @Field(() => ID)
  id: number;
  @Field(() => String)
  url: string;
  @Field(() => String, { nullable: true })
  alt?: string;
  @Field(() => StateImage)
  state_image: StateImage;
}
