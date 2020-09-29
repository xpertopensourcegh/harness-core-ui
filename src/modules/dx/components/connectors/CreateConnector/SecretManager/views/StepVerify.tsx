import React from 'react'
import type { StepProps } from '@wings-software/uikit'

import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import type { VerifyOutOfClusterStepProps } from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'

import i18n from '../CreateSecretManager.i18n'
import type { SecretManagerWizardData } from '../CreateSecretManager'

interface StepVerifyProps {
  onSuccess?: () => void
  hideLightModal?: () => void
}

const StepVerify: React.FC<
  StepVerifyProps & StepProps<VerifyOutOfClusterStepProps & SecretManagerWizardData>
> = props => {
  return (
    <VerifyOutOfClusterDelegate
      name={i18n.nameStepVerify}
      renderInModal={true}
      isLastStep={true}
      connectorIdentifier={props.prevStepData?.detailsData?.identifier}
      connectorName={props.prevStepData?.detailsData?.name}
      {...props}
    />
  )
}

export default StepVerify
