import { Controller, Get, Query, Req } from '@nestjs/common'
import type { AuthenticatedRequest } from 'src/auth/types'
import { Auth } from 'src/common/decorators/auth.decorator'
import type { JwtPayload } from 'types/jwt/jwt.types'
import { SEARCH_ROUTES } from './constants/search.routes'
import { SearchQueryDto } from './dto/search-query.dto'
import { SearchResponseDto } from './dto/search-response.dto'
import { SearchService } from './search.service'

@Controller(SEARCH_ROUTES.ROOT)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Auth()
  search(@Query() dto: SearchQueryDto, @Req() req: AuthenticatedRequest<JwtPayload>): Promise<SearchResponseDto> {
    return this.searchService.search(dto, req.user.sub)
  }
}
