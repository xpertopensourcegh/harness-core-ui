// TODO: Load data from API

import buildsJSON from './mocks/builds.json'
import buildJSON from './mocks/build.json'

import type { BuildResponse, BuildsResponse } from './Types'

export async function fetchBuilds(): Promise<BuildsResponse> {
  return Promise.resolve(buildsJSON as BuildsResponse)
}

export async function fetchBuild(): Promise<BuildResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(buildJSON as BuildResponse), 1000)
  })
}
