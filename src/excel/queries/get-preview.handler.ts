import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExcelService } from '../excel.service';
import { GetPreviewQuery } from './get-preview.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetPreviewQuery)
export class GetPreviewHandler implements IQueryHandler<GetPreviewQuery> {
  constructor(private readonly excelService: ExcelService) {}

  async execute(query: GetPreviewQuery): Promise<Buffer> {
    const { id } = query;
    const pdfBuffer = await this.excelService.getPDFBuffer(id);
    if (!pdfBuffer) {
      throw new NotFoundException('PDF not found');
    }
    return pdfBuffer;
  }
}
