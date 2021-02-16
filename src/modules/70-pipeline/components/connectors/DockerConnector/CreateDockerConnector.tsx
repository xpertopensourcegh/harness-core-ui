import React, { useState } from 'react'
import { StepWizard, Color, RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'

import type { ConnectorConfigDTO, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepDockerAuthentication from '@connectors/components/CreateConnector/DockerConnector/StepAuth/StepDockerAuthentication'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { ImagePath } from '@pipeline/components/ArtifactsSelection/DockerArtifact/ImagePath'
import css from './DockerConnector.module.scss'
interface CreateDockerConnectorProps {
  hideLightModal: () => void
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    tag?: string
    tagRegex?: string
  }) => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode?: boolean
  connectorInfo?: ConnectorInfoDTO | void
  context?: number
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  const { getString } = useStrings()
  const commonProps = pick(props, ['accountId', 'orgIdentifier', 'projectIdentifier'])

  const [isEditMode, setIsEditMode] = useState(false)
  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.DOCKER)}
      iconProps={{ size: 37, color: Color.WHITE }}
      title={getConnectorTitleTextByType(Connectors.DOCKER)}
      className={css.wrapper}
    >
      <ConnectorDetailsStep
        type={Connectors.DOCKER}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepDockerAuthentication
        name={getString('details')}
        {...commonProps}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={isEditMode}
        connectorInfo={props.connectorInfo}
        setIsEditMode={setIsEditMode}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep={true}
        isLastStep={false}
        type={Connectors.DOCKER}
      />
      <ImagePath
        name={getString('connectors.stepFourName')}
        handleSubmit={props.handleSubmit}
        initialValues={{ imagePath: '', tagType: 'value', tag: RUNTIME_INPUT_VALUE, tagRegex: '' }}
        context={props.context}
      />
    </StepWizard>
  )
}

export default CreateDockerConnector
