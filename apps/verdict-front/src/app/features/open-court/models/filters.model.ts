export interface Court {
    court_code: number;
    name: string;
  }
  
  export interface CourtResponse {
    count: number;
    courts: Court[];
  }
   export interface RegionResponse {
    count: number;
    regions: Region[];
  }
  
   export interface Region {
    region_code: number;
    name: string;
  }
  export interface JusticeKindResponse {
    count: number;
    justice_kinds: JusticeKind[];
  }
  
  export interface JusticeKind {
    category_code: number;
    justice_kind: number;
    name: string;
    categoryCount: number;
    checked: boolean;
    count: number;
    id: number;
  }
  export interface CategoryResponse {
    count: number;
    categories: Category[];
  }
  
  export interface Category {
    category_code: number;
    justice_kind: number;
    name: string;
    checked: boolean;
    count: number;
    categoryCount: number;
  }