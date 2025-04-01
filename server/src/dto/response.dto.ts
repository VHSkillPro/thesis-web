export class BaseResponseDto {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  pages: number;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.pages = Math.ceil(total / limit);
  }
}

export class PaginationResponseDto<T> extends BaseResponseDto {
  data: T[];
  meta: PaginationMetaDto;

  constructor(message: string, data: T[], meta: PaginationMetaDto) {
    super(message);
    this.data = data;
    this.meta = meta;
  }
}

export class ShowResponseDto<T> extends BaseResponseDto {
  data: T;

  constructor(message: string, data: T) {
    super(message);
    this.data = data;
  }
}
