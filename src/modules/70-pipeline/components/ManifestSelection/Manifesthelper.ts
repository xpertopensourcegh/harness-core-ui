import type { IconName } from '@wings-software/uicore'
import type { HelmVersionOptions, ManifestTypes } from './ManifestInterface'

export const ManifestDataType: { [key: string]: ManifestTypes } = {
  K8sManifest: 'K8sManifest',
  Values: 'Values',
  HelmChart: 'HelmChart'
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
