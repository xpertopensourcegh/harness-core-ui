import type { IconName } from '@wings-software/uicore'
import { getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ChangeSourceDTO } from 'services/cv'
import { ChangeSourceTypes } from './ChangeSourceDrawer/ChangeSourceDrawer.constants'

export const getIconBySource = (source: ChangeSourceDTO['type']): IconName => {
  switch (source) {
    case ChangeSourceTypes.HarnessCDNextGen:
      return 'cd-main' as IconName
    case ChangeSourceTypes.HarnessCD:
      return 'harness' as IconName
    default:
      return getConnectorIconByType(source || '')
  }
}
