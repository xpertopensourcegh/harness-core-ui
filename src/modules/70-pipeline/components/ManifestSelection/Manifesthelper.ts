import type { IconName } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import type { HelmVersionOptions, ManifestStores, ManifestTypes } from './ManifestInterface'

export const ManifestDataType: { [key: string]: ManifestTypes } = {
  K8sManifest: 'K8sManifest',
  Values: 'Values',
  HelmChart: 'HelmChart'
}

export const ManifestStoreMap: { [key: string]: ManifestStores } = {
  Git: 'Git',
  Github: 'Github',
  Gitlab: 'Gitlab',
  Bitbucket: 'Bitbucket',
  Http: 'Http'
}

export const manifestTypeIcons: Record<string, IconName> = {
  K8sManifest: 'service-kubernetes',
  Values: 'functions',
  HelmChart: 'service-helm'
}

export const manifestTypeLabels: { [key: string]: string } = {
  K8sManifest: 'K8s Manifest',
  Values: 'Values YAML',
  HelmChart: 'Helm Chart'
}

export const manifestTypeText: Record<string, string> = {
  K8sManifest: 'Manifest',
  Values: 'Values Overrides',
  HelmChart: 'Helm Chart'
}

export const helmVersions: Array<{ label: string; value: HelmVersionOptions }> = [
  { label: 'Version 2', value: 'V2' },
  { label: 'Version 3', value: 'V3' }
]
export const getManifestIconByType = (type: string | undefined): IconName => {
  switch (type) {
    case ManifestStoreMap.Git:
      return 'service-github'
    case ManifestStoreMap.Github:
      return 'github'
    case ManifestStoreMap.Gitlab:
      return 'service-gotlab'
    case ManifestStoreMap.Bitbucket:
      return 'bitbucket'
    case ManifestStoreMap.Http:
      return 'service-helm'
    default:
      return 'cog'
  }
}
export const getManifestStoreTitle = (type: string): string => {
  switch (type) {
    case ManifestStoreMap.Git:
      return 'connectors.title.gitConnector'
    case ManifestStoreMap.Github:
      return 'connectors.title.githubConnector'
    case ManifestStoreMap.Gitlab:
      return 'connectors.title.gitlabConnector'
    case ManifestStoreMap.Bitbucket:
      return 'connectors.title.bitbucketConnector'
    case ManifestStoreMap.Http:
      return 'connectors.title.helmConnector'
    default:
      return 'store'
  }
}

export const manifestStoreConnectorMap: Record<string, ConnectorInfoDTO['type']> = {
  Git: Connectors.GIT,
  Github: Connectors.GITHUB,
  Gitlab: Connectors.GITLAB,
  Bitbucket: Connectors.BITBUCKET,
  Http: Connectors.HttpHelmRepo,
  S3: Connectors.AWS,
  Gcs: Connectors.GCP
}
