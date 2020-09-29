import React from 'react'
import { Container, StepProps, Text } from '@wings-software/uikit'

import type { SecretManagerWizardData } from '../CreateSecretManager'
import i18n from '../CreateSecretManager.i18n'
import VaultConfigForm from './VaultConfigForm'

interface StepConfigureProps {
  closeModal?: () => void
  onSuccess?: () => void
}

const StepConfigure: React.FC<StepConfigureProps & StepProps<SecretManagerWizardData>> = ({
  prevStepData,
  nextStep,
  previousStep,
  onSuccess,
  closeModal
}) => {
  return (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleConnect}
      </Text>
      {(() => {
        switch (prevStepData?.detailsData?.encryptionType) {
          case 'Vault':
            return (
              <VaultConfigForm
                prevStepData={prevStepData}
                nextStep={nextStep}
                previousStep={previousStep}
                onSuccess={onSuccess}
                closeModal={closeModal}
              />
            )
          default:
            return <Text>Invalid Secret Manager Type</Text> // TODO: Handle better
        }
      })()}
    </Container>
  )
}

export default StepConfigure
