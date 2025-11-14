import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/modules/auth/decorator/public.decorator';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  @Public()
  hello(@Context() context) {
    console.log('-------Hahahhahahahahhaha-------')
    console.log(context.req.headers);
    return 'Hahahhahahahahhaha!';
  }
  @Query(() => String)
  me(@Context() context) {
    return `me me me`;
  }
}
