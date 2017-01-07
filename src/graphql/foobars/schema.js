import {
  FoobarQueryGetById,
  FoobarQuerySearch
} from './queries'

import {
  FoobarMutationCreate,
  FoobarMutationUpdate,
  FoobarMutationDelete
} from './mutations'

export const FoobarQueries = {
  getFoobar: FoobarQueryGetById,
  searchFoobar: FoobarQuerySearch
};

export const FoobarMutations = {
  createFoobar: FoobarMutationCreate,
  updateFoobar: FoobarMutationUpdate,
  deleteFoobar: FoobarMutationDelete
};