import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Roles } from '../enums/roles-user.enum';
import { CurrentUser } from '../interfaces';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUsers = createParamDecorator(
  (roles: Roles[], context: ExecutionContext) => {
    const ctxType = context.getType<string>();

    let request: any;
    if (ctxType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } else {
      // Asume que el contexto es HTTP si no es GraphQL
      request = context.switchToHttp().getRequest();
    }

    const user: CurrentUser = request.user;
    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request (RolesGuard called?)',
      );
    }

    if (!roles || roles.length === 0) return user;

    if (roles.includes(user.role as Roles)) return user;

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
