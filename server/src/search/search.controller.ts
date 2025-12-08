import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchQueryDto } from './dto/search-query.dto'
import { SearchResponseDto } from './dto/search-response.dto'
import { Auth } from 'src/common/decorators/auth.decorator'
import { SEARCH_ROUTES } from './constants/search.routes'

@Controller(SEARCH_ROUTES.ROOT)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Auth()
  search(@Query() dto: SearchQueryDto): Promise<SearchResponseDto> {
    return this.searchService.search(dto)
  }
}
