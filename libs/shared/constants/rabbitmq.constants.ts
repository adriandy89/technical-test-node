export enum RabbitMQ {
  APIGateway = 'api-gateway-rmq',
  CoreQueue = 'core-rmq',
}

export enum UserMsg {
  CREATE = 'CREATE_USER',
  FIND_ALL = 'FIND_USERS',
  FIND_ONE = 'FIND_ONE_USER',
  UPDATE = 'UPDATE_USER',
  DELETE = 'DELETE_USER',
  VALID_USER = 'VALID_USER',
  VALID_TOKEN_USER = 'VALID_TOKEN_USER',
}
