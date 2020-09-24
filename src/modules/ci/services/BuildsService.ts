import { useGet, UseGetProps } from 'restful-react'
import type { BuildData, BuildsResponse } from './Types'

export interface PageableParams {
  page?: string
}

export interface GetBuildsQueryParams extends PageableParams {
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string
}

export interface GetBuildQueryParams {
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string
}

export interface ErrorResponse {
  status?: 'SUCCESS' | 'FAILURE' | 'ERROR'
  code?: 'DEFAULT_ERROR_CODE'
  message?: string
}

export type UseGetBuildsProps = Omit<UseGetProps<BuildsResponse, ErrorResponse, GetBuildsQueryParams, void>, 'path'>

export type UseGetBuildProps = Omit<UseGetProps<BuildData, ErrorResponse, GetBuildQueryParams, void>, 'path'>

/**
 * Get builds
 */
export const useGetBuilds = (props: UseGetBuildsProps) =>
  useGet<BuildsResponse, ErrorResponse, GetBuildsQueryParams, void>(`/ci/builds`, {
    ...props
  })

/**
 * Get build
 */
export const useGetBuild = (buildId: string, props: UseGetBuildProps) =>
  useGet<BuildData, ErrorResponse, GetBuildQueryParams, void>(`/ci/builds/${buildId}`, {
    ...props
  })
