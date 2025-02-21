import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PostPageDto } from '../dtos/post-page.dto';
import { PostDto } from '../dtos/post.dto';

export const PostApiPaginatedResponse = () => {
  return applyDecorators(
    ApiExtraModels(PostPageDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PostPageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(PostDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
