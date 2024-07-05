// src/csv/queries/get-preview.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CsvService } from '../csv.service';
import { GetPreviewQuery } from './get-preview.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetPreviewQuery)
export class GetPreviewHandler implements IQueryHandler<GetPreviewQuery> {
  constructor(private readonly csvService: CsvService) {}

  async execute(query: GetPreviewQuery): Promise<Buffer> {
    const { id } = query;
    const pdfBuffer = await this.csvService.getPDFBuffer(id);
    if (!pdfBuffer) {
      throw new NotFoundException('PDF not found');
    }
    return pdfBuffer;
  }
}
