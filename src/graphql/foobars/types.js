import {
  connectionDefinitions
} from 'graphql-relay';

/*
 * Types
 */

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
} from 'graphql';

export const FoobarType = new GraphQLObjectType({
  name: 'Foobar',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    bar: {
      type: GraphQLString
    },
    created_at: {
      type: GraphQLString
    },
    updated_at: {
      type: GraphQLString
    },
    deleted_at: {
      type: GraphQLString
    }
  })
});

export const FoobarInputType = new GraphQLInputObjectType({
  name: 'FoobarInput',
  fields: () => ({
    name: {
      type: GraphQLString
    }
  })
});

export const { connectionType: FoobarConnection } = connectionDefinitions({
  nodeType: FoobarType
});
