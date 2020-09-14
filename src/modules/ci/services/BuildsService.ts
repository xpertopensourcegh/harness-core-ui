import buildsJSON from './mocks/builds.json'
import type { BuildsResponse } from './Types'

export async function fetchBuilds(/*props: { pageNumber: number; pageSize: number }*/): Promise<BuildsResponse> {
  return Promise.resolve(buildsJSON as BuildsResponse)
}
