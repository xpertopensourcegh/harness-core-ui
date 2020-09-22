import { useGet, UseGetProps } from 'restful-react'
import type { BuildResponse, BuildsResponse } from './Types'

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

export type UseGetBuildProps = Omit<UseGetProps<BuildResponse, ErrorResponse, GetBuildQueryParams, void>, 'path'>

/**
 * Get builds
 */
export const useGetBuilds = (props: UseGetBuildsProps) =>
  useGet<BuildsResponse, ErrorResponse, GetBuildsQueryParams, void>(`/ng/api/builds`, {
    ...props
  })

/**
 * Get build
 */
export const useGetBuild = (buildId: string, props: UseGetBuildProps) =>
  useGet<BuildResponse, ErrorResponse, GetBuildQueryParams, void>(`/ng/api/build/${buildId}`, {
    ...props
  })
