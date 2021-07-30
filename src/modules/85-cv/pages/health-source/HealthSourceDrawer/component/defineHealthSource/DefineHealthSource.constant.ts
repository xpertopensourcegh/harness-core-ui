import { Connectors } from '@connectors/constants'
import { getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { HealthSourceTypes } from '@cv/pages/health-source/types'

export const HEALTHSOURCE_LIST = [
  {
    name: Connectors.APP_DYNAMICS,
    icon: getConnectorIconByType(Connectors.APP_DYNAMICS)
  },
  {
    name: HealthSourceTypes.GoogleCloudOperations,
    icon: 'service-stackdriver'
  },
  {
    name: Connectors.PROMETHEUS,
    icon: getConnectorIconByType(Connectors.PROMETHEUS)
  },
  {
    name: Connectors.NEW_RELIC,
    icon: getConnectorIconByType(Connectors.NEW_RELIC)
  }
]

export const NewRelicProductNames = {
  APM: 'apm'
}
