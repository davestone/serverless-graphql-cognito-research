import { v4 as uuid } from 'node-uuid';

import {
  FoobarCreate,
  FoobarUpdateById,
  FoobarDeleteById
} from './persist';

/*
 * Types
 */

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import {
  FoobarType,
  FoobarInputType
} from './types';

/*
 * Mutations
 */

export const FoobarMutationDelete = {
  type: FoobarType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(parent, { id }) {
    return await FoobarDeleteById(id);
  }
};

export const FoobarMutationCreate = {
  type: FoobarType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(parent, item) {
    item.id = uuid();
    item.created_at = parseInt(new Date().getTime() / 1000, 0);
    return await FoobarCreate(item);
  }
};

export const FoobarMutationUpdate = {
  type: FoobarType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    input: {
      type: FoobarInputType
    }
  },
  async resolve(parent, { id, input }) {
    return await FoobarUpdateById(id, input);
  }
};
