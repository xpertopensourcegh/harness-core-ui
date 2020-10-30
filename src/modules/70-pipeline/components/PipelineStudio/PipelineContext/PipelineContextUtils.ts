/**
 * TODO: Temporary code for CRUD CI API operations for pipelines - only for stages that contains ci (build) stage
 */

import {
  postPipelinePromise,
  ResponseString,
  Failure,
  PostPipelineQueryParams,
  NgPipelineRequestBody,
  putPipelinePromise,
  PutPipelineQueryParams,
  PutPipelinePathParams,
  ResponseNGPipelineResponse,
  GetPipelineQueryParams,
  GetPipelinePathParams,
  getPipelinePromise
} from 'services/cd-ng'
import { getConfig, getUsingFetch, mutateUsingFetch, GetUsingFetchProps, MutateUsingFetchProps } from 'services/config'

export const postPipelinePromiseCI = (
  props: MutateUsingFetchProps<ResponseString, Failure | Error, PostPipelineQueryParams, NgPipelineRequestBody, void>,
  signal?: RequestInit['signal']
) =>
  mutateUsingFetch<ResponseString, Failure | Error, PostPipelineQueryParams, NgPipelineRequestBody, void>(
    'POST',
    getConfig('ci'),
    `/pipelines`,
    props,
    signal
  )

export const putPipelinePromiseCI = (
  {
    pipelineIdentifier,
    ...props
  }: MutateUsingFetchProps<
    ResponseString,
    Failure | Error,
    PutPipelineQueryParams,
    NgPipelineRequestBody,
    PutPipelinePathParams
  > & { pipelineIdentifier: string },
  signal?: RequestInit['signal']
) =>
  mutateUsingFetch<
    ResponseString,
    Failure | Error,
    PutPipelineQueryParams,
    NgPipelineRequestBody,
    PutPipelinePathParams
  >('PUT', getConfig('ng/api'), `/pipelines/${pipelineIdentifier}`, props, signal)

export const getPipelinePromiseCI = (
  {
    pipelineIdentifier,
    ...props
  }: GetUsingFetchProps<ResponseNGPipelineResponse, Failure | Error, GetPipelineQueryParams, GetPipelinePathParams> & {
    pipelineIdentifier: string
  },
  signal?: RequestInit['signal']
) =>
  getUsingFetch<ResponseNGPipelineResponse, Failure | Error, GetPipelineQueryParams, GetPipelinePathParams>(
    getConfig('ci'),
    `/pipelines/${pipelineIdentifier}`,
    props,
    signal
  )

export function postPipelinePromiseFactory(module: 'ci' | 'cd') {
  if (module === 'ci') {
    return postPipelinePromiseCI
  }
  return postPipelinePromise
}

export function putPipelinePromiseFactory(module: 'ci' | 'cd') {
  if (module === 'ci') {
    return putPipelinePromiseCI
  }
  return putPipelinePromise
}

export function getPipelinePromiseFactory(module: 'ci' | 'cd') {
  if (module === 'ci') {
    return getPipelinePromiseCI
  }
  return getPipelinePromise
}
