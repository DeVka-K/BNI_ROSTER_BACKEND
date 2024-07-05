// src/json-to-pdf/queries/handlers/get-json-to-pdf.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJsonToPdfQuery } from '../get-json-to-pdf.query';

@QueryHandler(GetJsonToPdfQuery)
export class GetJsonToPdfHandler implements IQueryHandler<GetJsonToPdfQuery> {
  async execute(query: GetJsonToPdfQuery): Promise<string> {
    const { jsonData } = query;
    // Logic to generate PDF preview URL from jsonData
    return 'placeholder-preview-url';
  }
}
