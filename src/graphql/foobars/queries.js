import {
  connectionArgs
} from 'graphql-relay';

import {
  FoobarFindById,
  FoobarSearch
} from './persist';

/*
 * Types
 */

import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

import {
  FoobarType,
  FoobarConnection
} from './types';

/*
 * Queries
 */

export const FoobarQueryGetById = {
  type: FoobarType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(parent, { id }) {
    // console.log(123, parent.currentUser.getUsername());
    return await FoobarFindById(id);
  }
};

export const FoobarQuerySearch = {
  type: FoobarConnection,
  args: Object.assign(
    connectionArgs, {
      name: { type: new GraphQLNonNull(GraphQLString) },
    }
  ),
  async resolve(parent, args) {
    return await FoobarSearch(args);
  }
};
