import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

describe('SearchController', () => {
  let controller: SearchController;

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call searchService.search with query and return result', async () => {
    const query: SearchQueryDto = { term: 'ai', limit: 10 };
    const result = {
      podcasts: [{ name: 'Podcast 1' }],
      episodes: [{ name: 'Episode 1' }],
    };

    mockSearchService.search.mockResolvedValue(result);

    const response = await controller.search(query);

    expect(mockSearchService.search).toHaveBeenCalledWith(query);
    expect(response).toEqual(result);
  });
});
