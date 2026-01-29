export interface IERPArrayListResponse<T> {
  items: T[];
  totalResults: number;
  count: number;
  hasMore: boolean;
  limit: number;
  offset: number;
}
