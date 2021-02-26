import React from 'react'
import { StepWizard, StepProps, Icon } from '@wings-software/uicore'
import { useStrings, String } from 'framework/exports'
import type { ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import { getConnectorIconByType, getConnectorTitleIdByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { ArtifactoryRepoType } from '../DockerArtifact/ArtifactoryRepoType'
import { ExampleStep } from '../DockerArtifact/ExampleStep'
import type { ConnectorRefLabelType, ConnectorDataType } from '../ArtifactsSelection'
import css from './ConnectorRefSteps.module.scss'

interface StepChangeData<SharedObject> {
  prevStep?: number
  nextStep?: number
  prevStepData: SharedObject
}
interface ConnectorRefStepsProps {
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
    tagType?: string
  }) => void
  handleViewChange: (isConnectorView: boolean) => void
  connectorData: ConnectorDataType
  types: Array<ConnectorInfoDTO['type']>
  lastSteps?: Array<React.ReactElement<StepProps<ConnectorConfigDTO>>> | null
  newConnectorSteps?: any
  labels: ConnectorRefLabelType
  selectedArtifact: ConnectorInfoDTO['type']
  changeArtifactType: (data: ConnectorInfoDTO['type']) => void
  newConnectorView: boolean
}

const ConnectorRefSteps: React.FC<ConnectorRefStepsProps> = props => {
  const { getString } = useStrings()

  const onStepChange = (arg: StepChangeData<any>): void => {
    if (arg?.prevStep && arg?.nextStep && arg.prevStep > arg.nextStep) {
      props.handleViewChange(false)
    }
  }

  const renderSubtitle = (): JSX.Element => {
    const stringId = getConnectorTitleIdByType(props.selectedArtifact)
    return (
      <div className={css.subtitle} style={{ display: 'flex' }}>
        <Icon name={getConnectorIconByType(props.selectedArtifact)} size={26} />
        <String style={{ alignSelf: 'center', marginLeft: 'var(--spacing-small)' }} stringID={stringId} />
      </div>
    )
  }
  return (
    <StepWizard className={css.existingDocker} subtitle={renderSubtitle()} onStepChange={onStepChange}>
      <ArtifactoryRepoType
        artifactTypes={props.types}
        name={getString('connectors.artifactRepoType')}
        stepName={props.labels.firstStepName}
        selectedArtifact={props.selectedArtifact}
        changeArtifactType={props.changeArtifactType}
      />
      <ExampleStep
        name={getString('connectors.artifactRepository')}
        stepName={props.labels.secondStepName}
        handleViewChange={() => props.handleViewChange(true)}
        initialValues={props.connectorData}
        connectorType={props.selectedArtifact}
        newConnectorLabel={props.labels.newConnector}
      />

      {props.newConnectorView ? props.newConnectorSteps : null}

      {props.lastSteps?.length ? props.lastSteps?.map(step => step) : null}
    </StepWizard>
  )
}

export default ConnectorRefSteps
