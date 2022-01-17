import React from 'react'
import { useStrings } from 'framework/strings'
import { WizardWithProgress } from '@common/components/WizardWithProgress/WizardWithProgress'
import { Status } from '@common/components/WizardWithProgress/WizardHelper'

import { GetDelegateTitleTextByType } from '@delegates/pages/delegates/utils/DelegateHelper'

import type { DelegateSetupDetails } from 'services/portal'

import { DelegateTypes } from '@delegates/constants'
import Step1Setup from './Step1Setup/Step1Setup'
import Step2Script from './Step2Script/Step2Script'
import Step3Verify from './Step3Verify/Step3Verify'

interface CreateDockerDelegateProps {
  onBack: any
  onClose?: any
}

export interface DockerDelegateWizardData {
  delegateDockerYaml?: DelegateSetupDetails | void
  name?: string
  tags?: string[]
  identifier?: string
  description?: string
  replicas?: number
  tokenName?: string
}

const CreateDockerDelegate: React.FC<CreateDockerDelegateProps> = ({ onClose, onBack }) => {
  const { getString } = useStrings()
  const panels = [
    {
      tabTitle: getString('delegates.delSetup'),
      id: 'delegateSetup',
      status: Status.INPROGRESS
    },
    { tabTitle: getString('delegates.reviewYAML'), id: 'reviewScript', status: Status.TODO },
    {
      tabTitle: getString('delegates.verification'),
      id: 'verifications',
      status: Status.TODO
    }
  ]
  return (
    <>
      <WizardWithProgress
        title={GetDelegateTitleTextByType(DelegateTypes.KUBERNETES_CLUSTER)}
        isNavMode={false}
        panels={panels}
      >
        <Step1Setup onBack={onBack} />
        <Step2Script />
        <Step3Verify onClose={onClose} />
      </WizardWithProgress>
    </>
  )
}

export default CreateDockerDelegate
