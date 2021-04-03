/* eslint-disable */
/**
 * This file is auto-generated. Please do not modify this file manually.
 * Use the command `yarn strings` to regenerate this file.
 */
export type HarnessModules =
  | 'common'
  | 'notifications'
  | 'rbac'
  | 'secrets'
  | 'connectors'
  | 'userProfile'
  | 'delegates'
  | 'projectsOrgs'
  | 'dashboards'
  | 'gitsync'
  | 'pipeline'
  | 'cd'
  | 'cf'
  | 'ci'
  | 'cv'
  | 'ce'
export type LangMapPromise = Promise<Record<string, any>>

function get_es_chunk_by_module(chunk: HarnessModules): LangMapPromise {
  switch (chunk) {
    case 'common':
      return import(
        /* webpackChunkName: "common.es" */
        /* webpackMode: "lazy" */
        '@common/strings/strings.es.yaml'
      )
    case 'notifications':
      return import(
        /* webpackChunkName: "notifications.es" */
        /* webpackMode: "lazy" */
        '@notifications/strings/strings.es.yaml'
      )
    case 'rbac':
      return import(
        /* webpackChunkName: "rbac.es" */
        /* webpackMode: "lazy" */
        '@rbac/strings/strings.es.yaml'
      )
    case 'secrets':
      return import(
        /* webpackChunkName: "secrets.es" */
        /* webpackMode: "lazy" */
        '@secrets/strings/strings.es.yaml'
      )
    case 'connectors':
      return import(
        /* webpackChunkName: "connectors.es" */
        /* webpackMode: "lazy" */
        '@connectors/strings/strings.es.yaml'
      )
    case 'userProfile':
      return import(
        /* webpackChunkName: "userProfile.es" */
        /* webpackMode: "lazy" */
        '@user-profile/strings/strings.es.yaml'
      )
    case 'delegates':
      return import(
        /* webpackChunkName: "delegates.es" */
        /* webpackMode: "lazy" */
        '@delegates/strings/strings.es.yaml'
      )
    case 'projectsOrgs':
      return import(
        /* webpackChunkName: "projectsOrgs.es" */
        /* webpackMode: "lazy" */
        '@projects-orgs/strings/strings.es.yaml'
      )
    case 'dashboards':
      return import(
        /* webpackChunkName: "dashboards.es" */
        /* webpackMode: "lazy" */
        '@dashboards/strings/strings.es.yaml'
      )
    case 'gitsync':
      return import(
        /* webpackChunkName: "gitsync.es" */
        /* webpackMode: "lazy" */
        '@gitsync/strings/strings.es.yaml'
      )
    case 'pipeline':
      return import(
        /* webpackChunkName: "pipeline.es" */
        /* webpackMode: "lazy" */
        '@pipeline/strings/strings.es.yaml'
      )
    case 'cd':
      return import(
        /* webpackChunkName: "cd.es" */
        /* webpackMode: "lazy" */
        '@cd/strings/strings.es.yaml'
      )
    case 'cf':
      return import(
        /* webpackChunkName: "cf.es" */
        /* webpackMode: "lazy" */
        '@cf/strings/strings.es.yaml'
      )
    case 'ci':
      return import(
        /* webpackChunkName: "ci.es" */
        /* webpackMode: "lazy" */
        '@ci/strings/strings.es.yaml'
      )
    case 'cv':
      return import(
        /* webpackChunkName: "cv.es" */
        /* webpackMode: "lazy" */
        '@cv/strings/strings.es.yaml'
      )
    case 'ce':
      return import(
        /* webpackChunkName: "ce.es" */
        /* webpackMode: "lazy" */
        '@ce/strings/strings.es.yaml'
      )
    default:
      return Promise.resolve({})
  }
}

function get_en_chunk_by_module(chunk: HarnessModules): LangMapPromise {
  switch (chunk) {
    case 'common':
      return import(
        /* webpackChunkName: "common.en" */
        /* webpackMode: "lazy" */
        '@common/strings/strings.en.yaml'
      )
    case 'notifications':
      return import(
        /* webpackChunkName: "notifications.en" */
        /* webpackMode: "lazy" */
        '@notifications/strings/strings.en.yaml'
      )
    case 'rbac':
      return import(
        /* webpackChunkName: "rbac.en" */
        /* webpackMode: "lazy" */
        '@rbac/strings/strings.en.yaml'
      )
    case 'secrets':
      return import(
        /* webpackChunkName: "secrets.en" */
        /* webpackMode: "lazy" */
        '@secrets/strings/strings.en.yaml'
      )
    case 'connectors':
      return import(
        /* webpackChunkName: "connectors.en" */
        /* webpackMode: "lazy" */
        '@connectors/strings/strings.en.yaml'
      )
    case 'userProfile':
      return import(
        /* webpackChunkName: "userProfile.en" */
        /* webpackMode: "lazy" */
        '@user-profile/strings/strings.en.yaml'
      )
    case 'delegates':
      return import(
        /* webpackChunkName: "delegates.en" */
        /* webpackMode: "lazy" */
        '@delegates/strings/strings.en.yaml'
      )
    case 'projectsOrgs':
      return import(
        /* webpackChunkName: "projectsOrgs.en" */
        /* webpackMode: "lazy" */
        '@projects-orgs/strings/strings.en.yaml'
      )
    case 'dashboards':
      return import(
        /* webpackChunkName: "dashboards.en" */
        /* webpackMode: "lazy" */
        '@dashboards/strings/strings.en.yaml'
      )
    case 'gitsync':
      return import(
        /* webpackChunkName: "gitsync.en" */
        /* webpackMode: "lazy" */
        '@gitsync/strings/strings.en.yaml'
      )
    case 'pipeline':
      return import(
        /* webpackChunkName: "pipeline.en" */
        /* webpackMode: "lazy" */
        '@pipeline/strings/strings.en.yaml'
      )
    case 'cd':
      return import(
        /* webpackChunkName: "cd.en" */
        /* webpackMode: "lazy" */
        '@cd/strings/strings.en.yaml'
      )
    case 'cf':
      return import(
        /* webpackChunkName: "cf.en" */
        /* webpackMode: "lazy" */
        '@cf/strings/strings.en.yaml'
      )
    case 'ci':
      return import(
        /* webpackChunkName: "ci.en" */
        /* webpackMode: "lazy" */
        '@ci/strings/strings.en.yaml'
      )
    case 'cv':
      return import(
        /* webpackChunkName: "cv.en" */
        /* webpackMode: "lazy" */
        '@cv/strings/strings.en.yaml'
      )
    case 'ce':
      return import(
        /* webpackChunkName: "ce.en" */
        /* webpackMode: "lazy" */
        '@ce/strings/strings.en.yaml'
      )
    default:
      return Promise.resolve({})
  }
}

export default function languageLoader(langId: string, chunk: HarnessModules): LangMapPromise {
  switch (langId) {
    case 'es':
      return get_es_chunk_by_module(chunk)
    case 'en':
    case 'en-US':
    case 'en-IN':
    case 'en-UK':
      return get_en_chunk_by_module(chunk)
    default:
      return get_en_chunk_by_module(chunk)
  }
}
