import React from 'react'
import { useStrings } from 'framework/strings'
import { DelegateTypes } from '@delegates/constants'
import CreateK8sDelegate from '@delegates/components/CreateDelegate/K8sDelegate/CreateK8sDelegate'
import CreateDockerDelegate from '@delegates/components/CreateDelegate/DockerDelegate/CreateDockerDelegate'
import DelegateSelectStep, {
  CardData
} from '@delegates/components/CreateDelegate/DelegateSelectStep/DelegateSelectStep'

interface DelegateWizardProps {
  type: string
  onBack: any
  onClose?: any
}

interface CreateDelegateWizardProps {
  onClose?: any
}

export const DelegateWizard: React.FC<DelegateWizardProps> = props => {
  const { type, onBack } = props
  switch (type) {
    case DelegateTypes.KUBERNETES_CLUSTER:
      return <CreateK8sDelegate onBack={onBack} onClose={props.onClose} />
    case DelegateTypes.DOCKER:
      return <CreateDockerDelegate onBack={onBack} onClose={props.onClose} />
    default:
      /* istanbul ignore next */
      return null
  }
}

export const CreateDelegateWizard: React.FC<CreateDelegateWizardProps> = props => {
  const { getString } = useStrings()
  const [showWizard, setShowWizard] = React.useState(false)
  const [delType, setDelType] = React.useState(DelegateTypes.DOCKER)
  return (
    <div>
      {!showWizard && (
        <DelegateSelectStep
          type={delType}
          name={getString('delegate.stepOneWizard')}
          onClick={(selectedCard: CardData) => {
            setDelType(selectedCard?.type)
            setShowWizard(true)
          }}
        />
      )}
      {showWizard && (
        <DelegateWizard
          {...props}
          type={delType}
          onBack={() => {
            setShowWizard(false)
          }}
        />
      )}
    </div>
  )
}
