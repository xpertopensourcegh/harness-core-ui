import React from 'react'
import { Delegates } from '@delegates/constants'
import CreateK8sDelegate from '@delegates/components/CreateDelegate/K8sDelegate/CreateK8sDelegate'
import type { DelegateInfoDTO } from 'services/cd-ng'

interface CreateDelegateWizardProps {
  type: DelegateInfoDTO['type']
}

export const DelegateWizard: React.FC<CreateDelegateWizardProps> = props => {
  const { type } = props
  switch (type) {
    case Delegates.KUBERNETES_CLUSTER:
      return <CreateK8sDelegate />
    default:
      /* istanbul ignore next */
      return null
  }
}

export const CreateDelegateWizard: React.FC<CreateDelegateWizardProps> = props => {
  return (
    <div>
      <DelegateWizard {...props} />
    </div>
  )
}
