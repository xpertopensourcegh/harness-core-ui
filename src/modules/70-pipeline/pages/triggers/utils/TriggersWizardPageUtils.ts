import { isNull, isUndefined, omitBy } from 'lodash-es'
import type { GetActionsListQueryParams, NGTriggerConfig, NgPipeline, NGTriggerSource } from 'services/cd-ng'
import type { PanelInterface } from '@common/components/Wizard/Wizard'
import type { PayloadConditionInterface } from '../views/PayloadConditionsSection'

export interface FlatInitialValuesInterface {
  triggerType: NGTriggerSource['type']
  sourceRepo?: GetActionsListQueryParams['sourceRepo'] | string
  identifier: string
  tags: {
    [key: string]: string
  }
  pipeline?: string
  originalPipeline?: NgPipeline
  name?: string
}
export interface FlatOnEditValuesInterface {
  name: string
  identifier: string
  description?: string
  tags?: {
    [key: string]: string
  }
  pipeline: string
  originalPipeline?: NgPipeline
  sourceRepo: GetActionsListQueryParams['sourceRepo']
  triggerType: string
  repoUrl: string
  event: string
  actions: string[]
  sourceBranchOperator?: string
  sourceBranchValue?: string
  targetBranchOperator?: string
  targetBranchValue?: string
  payloadConditions?: PayloadConditionInterface[]
}

export interface FlatValidFormikValuesInterface {
  name: string
  identifier: string
  description?: string
  tags?: {
    [key: string]: string
  }
  target?: string
  targetIdentifier?: string
  pipeline: NgPipeline
  sourceRepo: GetActionsListQueryParams['sourceRepo']
  triggerType: string
  repoUrl: string
  event: string
  actions: string[]
  sourceBranchOperator?: string
  sourceBranchValue?: string
  targetBranchOperator?: string
  targetBranchValue?: string
  payloadConditions?: PayloadConditionInterface[]
}

export const TriggerTypes = {
  WEBHOOK: 'Webhook',
  NEW_ARTIFACT: 'NewArtifact',
  SCHEDULED: 'Scheduled'
}

interface TriggerTypeSourceInterface {
  triggerType: string
  sourceRepo: GetActionsListQueryParams['sourceRepo']
}

export const PayloadConditionTypes = {
  TARGET_BRANCH: 'targetBranch',
  SOURCE_BRANCH: 'sourceBranch'
}
export const ResponseStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  ERROR: 'ERROR'
}

const getTriggerTitle = ({
  triggerType,
  triggerName,
  getString
}: {
  triggerType: string
  triggerName?: string
  getString: (key: string) => string
}): string => {
  if (triggerName) {
    return `Trigger: ${triggerName}`
  } else if (triggerType === TriggerTypes.WEBHOOK) {
    return getString('pipeline-triggers.onNewWebhookTitle')
  } else if (triggerType === 'OnArtifact') {
    return getString('pipeline-triggers.onNewArtifactTitle')
  }
  return ''
}

interface TriggerConfigDTO extends Omit<NGTriggerConfig, 'identifier'> {
  identifier?: string
}

// todo: revisit to see how to require identifier w/o type issue
export const clearNullUndefined = /* istanbul ignore next */ (data: TriggerConfigDTO): TriggerConfigDTO =>
  omitBy(omitBy(data, isUndefined), isNull)

export const getQueryParamsOnNew = (searchStr: string): TriggerTypeSourceInterface => {
  const triggerTypeParam = 'triggerType='
  const sourceRepoParam = '&sourceRepo='
  return {
    triggerType: (searchStr.substring(
      searchStr.lastIndexOf(triggerTypeParam) + triggerTypeParam.length,
      searchStr.lastIndexOf(sourceRepoParam)
    ) as unknown) as string,
    sourceRepo: (searchStr.substring(
      searchStr.lastIndexOf(sourceRepoParam) + sourceRepoParam.length
    ) as unknown) as GetActionsListQueryParams['sourceRepo']
  }
}
export const isUndefinedOrEmptyString = (str: string | undefined): boolean => isUndefined(str) || str?.trim() === ''

const isRowUnfilled = (payloadCondition: PayloadConditionInterface): boolean => {
  const truthyValuesLength = Object.values(payloadCondition).filter(val => isUndefinedOrEmptyString(val?.trim()))
    ?.length
  return truthyValuesLength > 0 && truthyValuesLength < 3
}

const checkValidPayloadConditions = (formikValues: FlatValidFormikValuesInterface): boolean => {
  const payloadConditions = formikValues['payloadConditions']
  if (
    (formikValues['sourceBranchOperator'] && !formikValues['sourceBranchValue']) ||
    (!formikValues['sourceBranchOperator'] && formikValues['sourceBranchValue']) ||
    (formikValues['targetBranchOperator'] && !formikValues['targetBranchValue']) ||
    (!formikValues['targetBranchOperator'] && formikValues['targetBranchValue']) ||
    (payloadConditions?.length &&
      payloadConditions.some((payloadCondition: PayloadConditionInterface) => isRowUnfilled(payloadCondition)))
  ) {
    return false
  }
  return true
}

const getPanels = (getString: (key: string) => string): PanelInterface[] => [
  {
    id: 'Trigger Configuration',
    tabTitle: getString('pipeline-triggers.triggerConfigurationLabel'),
    requiredFields: ['name', 'identifier', 'event', 'repoUrl', 'actions']
  },
  {
    id: 'Conditions',
    tabTitle: getString('pipeline-triggers.conditionsLabel'),
    checkValidPanel: checkValidPayloadConditions
  },
  {
    id: 'Pipeline Input',
    tabTitle: getString('pipeline-triggers.pipelineInputLabel')
    // require all fields for input set and have preflight check handled on backend
  }
]

export const getWizardMap = ({
  triggerType,
  getString,
  triggerName
}: {
  triggerType: string
  triggerName?: string
  getString: (key: string) => string
}): { wizardLabel: string; panels: PanelInterface[] } => ({
  wizardLabel: getTriggerTitle({
    triggerType,
    getString,
    triggerName
  }),
  panels: getPanels(getString)
})
