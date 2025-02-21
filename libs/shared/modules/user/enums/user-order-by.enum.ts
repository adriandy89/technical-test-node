export const UserOrderBy = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  username: 'username',
  name: 'name',
  role: 'role',
  enabled: 'enabled',
};

export type UserOrderBy = (typeof UserOrderBy)[keyof typeof UserOrderBy];
