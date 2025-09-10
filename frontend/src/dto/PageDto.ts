export interface PageDto<T> {
  content: [T];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: true;
      sorted: boolean;
      unsorted: true;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}
