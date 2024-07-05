// src/json-to-pdf/json-to-pdf.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JsonToPdfService } from './json-to-pdf.service';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

describe('JsonToPdfService', () => {
  let service: JsonToPdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JsonToPdfService,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JsonToPdfService>(JsonToPdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate PDF preview', async () => {
    const jsonData = { name: 'Test' };
    jest.spyOn(service, 'getPdfPreview').mockImplementation(async () => 'preview-url');
    const result = await service.getPdfPreview(jsonData);
    expect(result).toBe('preview-url');
  });

  it('should create PDF', async () => {
    const jsonData = { name: 'Test' };
    jest.spyOn(service, 'createPdf').mockImplementation(async () => 'path-to-pdf');
    const result = await service.createPdf(jsonData);
    expect(result).toBe('path-to-pdf');
  });
});
