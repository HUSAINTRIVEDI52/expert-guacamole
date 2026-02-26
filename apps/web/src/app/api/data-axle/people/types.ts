/**
 * Types for Data Axle People Search API
 * @see https://platform.data-axle.com/people/docs/search_api
 * @see https://platform.data-axle.com/people/docs/filter_dsl
 */

/** Basic relation filter: attribute comparison */
export interface DataAxleRelationFilter {
  relation:
    | "equals"
    | "matches"
    | "in"
    | "between"
    | "greater_than"
    | "less_than"
    | "missing"
    | "present"
    | "range";
  attribute: string;
  value?: string | number | string[] | number[] | Record<string, unknown>;
  negated?: boolean;
}

/** Geo distance filter */
export interface DataAxleGeoDistanceFilter {
  relation: "geo_distance";
  value: {
    distance: string;
    lat?: number;
    lon?: number;
    postal_codes?: string[];
  };
}

/** Geo box filter */
export interface DataAxleGeoBoxFilter {
  relation: "geo_box";
  value: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

/** Connective (AND/OR) filter */
export interface DataAxleConnectiveFilter {
  connective: "and" | "or";
  propositions: DataAxleFilter[];
}

export type DataAxleFilter =
  | DataAxleRelationFilter
  | DataAxleGeoDistanceFilter
  | DataAxleGeoBoxFilter
  | DataAxleConnectiveFilter;

/** Request body for People Search API (JSON body) */
export interface DataAxlePeopleSearchBody {
  query?: string;
  contract?: string;
  packages?: string[];
  fields?: string[];
  filter?: DataAxleFilter;
  limit?: number;
  offset?: number;
  sort?: Array<string | Record<string, string | Record<string, number>>>;
  scoring?: Record<string, string>;
  perspective?: string;
  include_labels?: boolean;
  include_ranges?: boolean;
  ids?: string[];
}

/** Response from Data Axle People Search API */
export interface DataAxlePeopleSearchResponse {
  count: number;
  documents: Record<string, unknown>[];
}
