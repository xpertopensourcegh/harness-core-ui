import type { ConnectorConfigDTO } from 'services/cd-ng'
import type { PagerDutyInitialValue } from '@connectors/pages/connectors/utils/ConnectorUtils'
import { setSecretField } from '@secrets/utils/SecretField'

export interface SpecData {
  apiTokenRef: string
  delegateSelectors: string
}

export interface PrevData {
  name: string
  identifier: string
  description: string
  orgIdentifier: string
  projectIdentifier: string
  tags: any
  type: string
}

type AllowedKeyList = keyof PrevData & keyof SpecData

export async function initializePagerDutyConnectorWithStepData(
  prevStepData: ConnectorConfigDTO | undefined,
  accountId = ''
): Promise<ConnectorConfigDTO | undefined> {
  if (!prevStepData) {
    return
  }

  const { spec, ...prevData } = prevStepData
  const updatedInitialValues = {
    ...spec,
    ...prevData
  }

  updateInitialValue(prevData as PrevData, spec as SpecData, updatedInitialValues, 'apiTokenRef' as AllowedKeyList)

  const initValueWithSecrets = await setPagerDutySecrets(updatedInitialValues, accountId)
  initValueWithSecrets.loading = false
  return initValueWithSecrets
}

function updateInitialValue(
  prevData: PrevData,
  spec: SpecData,
  updatedInitialValues: PrevData & SpecData,
  key: AllowedKeyList
): void {
  if (prevData && prevData[key]) {
    updatedInitialValues[key] = prevData[key]
  } else if (spec && spec[key]) {
    updatedInitialValues[key] = spec[key]
  }
}

export async function setPagerDutySecrets(
  initialValues: PagerDutyInitialValue,
  accountId: string
): Promise<PagerDutyInitialValue> {
  const { projectIdentifier, orgIdentifier, apiTokenRef } = initialValues || {}
  if (apiTokenRef && typeof apiTokenRef !== 'object') {
    const resultAPIkey = await setSecretField(apiTokenRef, {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    })
    initialValues.apiTokenRef = resultAPIkey
  }
  return initialValues
}
