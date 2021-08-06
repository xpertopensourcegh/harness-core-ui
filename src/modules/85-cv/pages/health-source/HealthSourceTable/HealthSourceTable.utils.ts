import type { IconName } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import type { UseStringsReturn } from 'framework/strings'
import { HealthSourceTypes } from '../types'

export const getTypeByFeature = (feature: string, getString: UseStringsReturn['getString']): string => {
  switch (feature) {
    case Connectors.APP_DYNAMICS:
    case Connectors.GCP:
    case Connectors.NEW_RELIC:
    case Connectors.PROMETHEUS:
    case HealthSourceTypes.StackdriverMetrics:
      return getString('pipeline.verification.analysisTab.metrics')
    case HealthSourceTypes.StackdriverLog:
      return getString('pipeline.verification.analysisTab.logs')
    default:
      return ''
  }
}

export const getIconBySourceType = (type: string): IconName => {
  switch (type) {
    case 'KUBERNETES':
      return 'service-kubernetes'
    case 'APP_DYNAMICS':
    case 'AppDynamics':
      return 'service-appdynamics'
    case 'HARNESS_CD10':
      return 'harness'
    case 'STACKDRIVER':
      return 'service-stackdriver'
    case 'NEW_RELIC':
    case 'NewRelic':
      return 'service-newrelic'
    case 'HEALTH':
      return 'health'
    case 'CANARY':
      return 'canary-outline'
    case 'BLUE_GREEN':
      return 'bluegreen'
    case 'TEST':
      return 'lab-test'
    case 'PROMETHEUS':
    case 'Prometheus':
      return 'service-prometheus'
    //TODO one type will be removed once it is full deprecated from backend.
    case 'STACKDRIVER_LOG':
    case 'StackdriverLog':
    case 'Stackdriver':
      return 'service-stackdriver'
    default:
      return 'placeholder'
  }
}
