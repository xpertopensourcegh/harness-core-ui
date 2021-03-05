import type { IconName } from '@wings-software/uicore'

export const manifestTypeIcons: Record<string, IconName> = {
  K8sManifest: 'service-kubernetes',
  Values: 'functions',
  Helm: 'service-helm'
}

export const manifestTypeLabels: { [key: string]: string } = {
  K8sManifest: 'K8s Manifest',
  Values: 'Values YAML',
  Helm: 'Helm Chart'
}

export const manifestTypeText: Record<string, string> = {
  K8sManifest: 'Manifest',
  Values: 'Values Overrides',
  Helm: 'Helm'
}
