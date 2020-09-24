import React, { useState } from 'react'
import { StepWizard } from '@wings-software/uikit'
import { pick } from 'lodash-es'

import { VaultConfigDTO, useCreateConnector, ConnectorRequestWrapper, ConnectorConfigDTO } from 'services/cd-ng'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useToaster } from 'modules/common/exports'
import { Connectors } from 'modules/dx/constants'
import StepConnect from './views/StepConnect'
import StepEngine from './views/StepEngine'
import type { ConnectFormData } from './views/StepConnect'
import type { SecretEngineData } from './views/StepEngine'

import i18n from './CreateSecretManager.i18n'

interface CreateSecretManagerProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
  onSuccess: () => void
}

export interface SecretManagerWizardData {
  detailsData?: ConnectorConfigDTO
  connectData?: ConnectFormData
  secretEngineData?: SecretEngineData
}

const CreateSecretManager: React.FC<CreateSecretManagerProps> = ({
  accountId,
  orgIdentifier,
  projectIdentifier,
  hideLightModal,
  onSuccess
}) => {
  const [formData, setFormData] = useState<VaultConfigDTO | undefined>()
  const { showSuccess } = useToaster()
  const { mutate: createSecretManager, loading } = useCreateConnector({ accountIdentifier: accountId })

  return (
    <>
      <StepWizard<SecretManagerWizardData>
        onCompleteWizard={async data => {
          if (data) {
            const dataToSubmit: ConnectorRequestWrapper = {
              connector: {
                orgIdentifier,
                projectIdentifier,
                ...pick(data, ['name', 'identifier', 'description', 'tags']),
                type: data.connectData?.encryptionType,
                spec: {
                  ...pick(data.connectData, ['authToken', 'basePath', 'vaultUrl', 'readOnly', 'default']),
                  ...pick(data.secretEngineData, ['secretEngineName', 'secretEngineVersion', 'renewIntervalHours'])
                } as VaultConfigDTO
              }
            }

            try {
              await createSecretManager(dataToSubmit)
              onSuccess()
              showSuccess(i18n.messageSuccess)
              hideLightModal()
            } catch (err) {
              // handle error
            }
          }
        }}
      >
        <ConnectorDetailsStep
          type={Connectors.VAULT}
          name={i18n.titleSecretManager}
          setFormData={data => setFormData(data as VaultConfigDTO)}
          formData={formData}
        />
        <StepConnect name={i18n.nameStepConnect} />
        <StepEngine name={i18n.nameStepSecretEngine} loading={loading} />
      </StepWizard>
    </>
  )
}

export default CreateSecretManager
