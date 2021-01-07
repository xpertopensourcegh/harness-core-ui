import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { Delegates } from '@delegates/constants'
import { GetDelegateTitleTextByType } from '@delegates/pages/delegates/utils/DelegateHelper'
import { useStrings } from 'framework/exports'
import type { DelegateInfoDTO } from 'services/cd-ng'
import DelegateDetailsStep from '../commonSteps/DelegateDetailsStep'
import Stepk8ReviewScript from './StepReviewScript/Stepk8sReviewScript'
import css from './CreateK8sDelegate.module.scss'

interface CreateK8sDelegateProps {
  delegateInfo?: DelegateInfoDTO | void
}

const CreateK8sDelegate: React.FC<CreateK8sDelegateProps> = () => {
  const { getString } = useStrings()

  return (
    <StepWizard
      title={GetDelegateTitleTextByType(Delegates.KUBERNETES_CLUSTER)}
      isNavMode={false}
      className={css.stepWizard}
    >
      <DelegateDetailsStep type={Delegates.KUBERNETES_CLUSTER} name={getString('delegate.stepOneWizard')} />
      <Stepk8ReviewScript />
    </StepWizard>
  )
}

export default CreateK8sDelegate
