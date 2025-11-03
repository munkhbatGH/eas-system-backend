import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

export const QraphqlClient = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true, // Automatically generate schema
  playground: true, // Enable playground
  path: '/graphql', // Default path
  context: ({ req }) => ({ req }), // 👈 Needed for @Context().req
})