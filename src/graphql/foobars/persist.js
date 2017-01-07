import {
  paginationToParams,
  dataToConnection
} from 'graphql-dynamodb-connections';

/*
 * Where?
 */

import DynamoDB from 'aws-sdk/clients/dynamodb';
const docClient = new DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION
});

/*
 * Helpers
 */

var parseNaming = {
  i: 'id',
  n: 'name',
  ca: 'created_at',
  ua: 'updated_at',
  da: 'deleted_at'
};

export function FoobarParseOut(item) {
  let clone = Object.assign({}, item);
  Object.keys(parseNaming).forEach((key) => {
    if (clone[key]) {
      clone[parseNaming[key]] = clone[key];
      delete clone[key];
    }
  });

  if (process.env.DEBUG === 'true') {
    console.log('FOOBAR', 'OUT', clone);
  }

  // computed
  clone.bar = 'Hardcoded';

  return clone;
}

export function FoobarParseIn(item) {
  let clone = Object.assign({}, item);
  Object.keys(parseNaming).forEach((key) => {
    if (clone[parseNaming[key]]) {
      clone[key] = clone[parseNaming[key]];
      delete clone[parseNaming[key]];
    }
  });

  if (process.env.DEBUG === 'true') {
    console.log('FOOBAR', 'IN', clone);
  }

  return clone;
}

/*
 * How?
 */

export function FoobarCreate(item) {
  let pItem = FoobarParseIn(item);
  return docClient.put({
    TableName: process.env.DYNAMO_FOOBARS,
    Item: pItem
  }, (err) => {
    if (err) {
      console.log('ERROR', err);
    }
  })
    .promise()
    .then((res) => {
      return item;
    });
}

export function FoobarFindById(i) {
  if (process.env.DEBUG === 'true') {
    console.log('FOOBAR', 'FINDBYID', i);
  }

  return docClient.get({
    TableName: process.env.DYNAMO_FOOBARS,
    Key: {
      i: i
    }
  }, (err) => {
    if (err) {
      console.log('ERROR', err);
    }
  })
    .promise()
    .then((res) => {
      return FoobarParseOut(res.Item);
    });
}

export function FoobarUpdateById(i, input) {
  return FoobarFindById(i).then((res) => {
    let AttributeUpdates = {
      ua: {
        Action: 'PUT',
        Value: parseInt(new Date().getTime() / 1000, 0)
      }
    };

    Object.keys(FoobarParseIn(input)).forEach((key) => {
      AttributeUpdates[key] = {
        Action: 'PUT',
        Value: input[parseNaming[key]]
      };
    });

    return docClient.update({
      TableName: process.env.DYNAMO_FOOBARS,
      Key: {
        i: res.id
      },
      AttributeUpdates: AttributeUpdates
    }, (err) => {
      if (err) {
        console.log('ERROR', err);
      }
    })
      .promise()
      .then(() => {
        return Object.assign(res, input);
      });
  });
}

export function FoobarDeleteById(i) {
  return FoobarUpdateById(i, { deleted_at: parseInt(new Date().getTime() / 1000, 0) });
}

export function FoobarSearch(query) {
  if (process.env.DEBUG === 'true') {
    console.log('FOOBAR', 'SEARCH', query);
  }

  const queryParams = Object.assign(
    { TableName: process.env.DYNAMO_FOOBARS },
    paginationToParams(query)
  );

  queryParams.FilterExpression = 'attribute_not_exists(da) AND begins_with(n, :name)';
  queryParams.ExpressionAttributeValues = {
    ':name': query.name
  };

  return docClient.scan(queryParams, (err) => {
    if (err) {
      console.log('ERROR', err);
    }
  })
    .promise()
    .then((res) => {
      res.Items = res.Items.map(item => FoobarParseOut(item));
      return res;
    })
    .then(dataToConnection);
}
