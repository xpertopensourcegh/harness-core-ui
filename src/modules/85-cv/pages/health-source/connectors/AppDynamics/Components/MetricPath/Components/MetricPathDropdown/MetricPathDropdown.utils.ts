import type { IconName } from '@wings-software/uicore'
import type { AppDynamicsFileDefinition } from 'services/cv'

export const getIconByType = (type: AppDynamicsFileDefinition['type']): IconName => {
  switch (type) {
    case 'folder':
      return 'main-folder-open'
    case 'leaf':
      return 'main-like'
    default:
      return 'main-issue'
  }
}
