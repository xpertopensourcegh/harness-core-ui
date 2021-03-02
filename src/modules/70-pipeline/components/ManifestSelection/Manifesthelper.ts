import type { IconName } from '@wings-software/uicore'

export const manifestTypeIcons: Record<string, IconName> = {
  K8sManifest: 'service-kubernetes',
  Values: 'functions'
}

export const manifestTypeLabels: { [key: string]: string } = {
  K8sManifest: 'K8s Manifest',
  Values: 'Values YAML'
}

export const manifestTypeText: Record<string, string> = {
  K8sManifest: 'Manifest',
  Values: 'Values Overrides'
}
