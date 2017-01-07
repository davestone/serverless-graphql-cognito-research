import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { FoobarQueries, FoobarMutations } from './foobars/schema';

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => Object.assign(
      FoobarQueries
    )
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => Object.assign(
      FoobarMutations
    )
  })
});

export default Schema;