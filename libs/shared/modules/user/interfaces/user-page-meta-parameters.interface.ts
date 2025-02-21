import { IPageMetaParametersDto } from '@app/shared/pagination';
import { UserPageOptionsDto } from '../dtos/user-page-options.dto';

export interface IUserPageMetaParametersDto extends IPageMetaParametersDto {
  pageOptions: UserPageOptionsDto;
}
