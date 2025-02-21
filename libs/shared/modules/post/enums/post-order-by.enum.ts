export const PostOrderBy = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  content: 'content',
  authorId: 'authorId',
};

export type PostOrderBy = (typeof PostOrderBy)[keyof typeof PostOrderBy];
