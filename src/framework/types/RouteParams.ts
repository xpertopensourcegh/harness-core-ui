export interface RouteParams {
  urlParams: Readonly<Record<string, string | number>>
  queryParams: Readonly<Record<string, string | number>>
}
