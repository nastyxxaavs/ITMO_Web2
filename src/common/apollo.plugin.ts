import { ApolloServerPlugin } from '@apollo/server';

export const ElapsedTimeApolloPlugin = (): ApolloServerPlugin => {
  return {
    async requestDidStart() {
      const start = Date.now();

      return {
        async willSendResponse(requestContext) {
          const elapsed = Date.now() - start;
          requestContext.response.http?.headers.set('X-Elapsed-Time', `${elapsed}ms`);
        },
      };
    },
  };
};
