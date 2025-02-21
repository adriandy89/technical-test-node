import { IPageMetaParametersDto } from '@app/shared/pagination';
import { PostPageOptionsDto } from '../dtos/post-page-options.dto';

export interface IPostPageMetaParametersDto extends IPageMetaParametersDto {
  pageOptions: PostPageOptionsDto;
}
