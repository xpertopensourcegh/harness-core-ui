import { Connectors } from '@connectors/constants'
import type { CardSelectOption } from './ChangeSourceDrawer.types'

export const HarnessCD = 'HarnessCD'

export const CHANGESOURCE_OPTIONS = [
  { label: 'deploymentText', value: 'Deployment' },
  { label: 'infrastructureText', value: 'Infrastructure' },
  { label: 'cv.changeSource.alertText', value: 'Alert' }
]

export const CARD_OPTIONS: CardSelectOption[] = [
  { label: 'cv.onboarding.changeSourceTypes.HarnessCDNextGen.name', value: HarnessCD, category: 'Deployment' },
  { label: 'kubernetesText', value: Connectors.KUBERNETES_CLUSTER, category: 'Infrastructure' },
  { label: 'common.pagerDuty', value: Connectors.PAGER_DUTY, category: 'Alert' }
]
