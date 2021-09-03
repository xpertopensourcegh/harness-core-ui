import type { UseStringsReturn } from 'framework/strings'
import type { DatasourceTypeDTO } from 'services/cv'

export function dataSourceTypeToLabel(
  dataSourceType: DatasourceTypeDTO['dataSourceType'],
  getString: UseStringsReturn['getString']
): string {
  switch (dataSourceType) {
    case 'APP_DYNAMICS':
      return getString('connectors.appdLabel')
    case 'SPLUNK':
      return getString('connectors.splunkLabel')
    case 'STACKDRIVER':
      return getString('connectors.stackdriverMetricsLabel')
    case 'STACKDRIVER_LOG':
      return getString('connectors.stackdriverLogsLabel')
    case 'NEW_RELIC':
      return getString('connectors.newRelicLabel')
    case 'PROMETHEUS':
      return getString('connectors.prometheusLabel')
    default:
      return ''
  }
}
