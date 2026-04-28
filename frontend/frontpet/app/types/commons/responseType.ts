export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  error: string;
  meta: ResponseMeta;
  items: T[];
  item: T;
  file?: string;
}
