import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const contextType = host.getType();

    // Manejo de excepciones para HTTP
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const rpcError = exception.getError();

      if (typeof rpcError === 'string') {
        return response.status(500).json({
          status: 500,
          message: rpcError.includes('Empty response')
            ? rpcError.substring(0, rpcError.indexOf('(') - 1)
            : rpcError,
        });
      }

      if (
        typeof rpcError === 'object' &&
        'status' in rpcError &&
        'message' in rpcError
      ) {
        const status = isNaN(+rpcError['status']) ? 400 : +rpcError['status'];
        return response.status(status).json(rpcError);
      }

      return response.status(400).json({
        status: 400,
        message: JSON.stringify(rpcError),
      });
    }

    // Manejo de excepciones para GraphQL
    if (contextType === 'rpc') {
      // Para GraphQL, ya que 'rpc' es el tipo de contexto para los microservicios
      const gqlHost = GqlArgumentsHost.create(host);
      const rpcError = exception.getError();

      if (typeof rpcError === 'string') {
        throw new Error(rpcError);
      }

      if (typeof rpcError === 'object' && 'message' in rpcError) {
        throw new Error((rpcError as any).message);
      }

      throw new Error(JSON.stringify(rpcError));
    }

    // Fallback en caso de que el contexto no sea HTTP ni RPC (GraphQL debería estar en RPC)
    throw new Error('Unexpected error context');
  }
}
