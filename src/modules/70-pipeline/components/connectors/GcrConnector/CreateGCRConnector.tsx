import React, { useState } from 'react'
import { StepWizard, Color, RUNTIME_INPUT_VALUE } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'

import type { ConnectorConfigDTO, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import GcrAuthentication from '@connectors/components/CreateConnector/GcrConnector/StepAuth/GcrAuthentication'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { ImagePath } from '@pipeline/components/ArtifactsSelection/DockerArtifact/ImagePath'
import css from './GCRConnector.module.scss'
interface CreateGCRConnectorProps {
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
  context?: number
  connectorInfo?: ConnectorInfoDTO | void
}

const CreateGCRConnector: React.FC<CreateGCRConnectorProps> = props => {
  const { getString } = useStrings()

  const [isEditMode, setIsEditMode] = useState(false)
  return (
    <StepWizard
      icon={getConnectorIconByType('Gcr')}
      iconProps={{ size: 37, color: Color.WHITE }}
      title={getConnectorTitleTextByType('Gcr')}
      className={css.wrapper}
    >
      <ConnectorDetailsStep
        type={('Gcr' as unknown) as ConnectorInfoDTO['type']}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <GcrAuthentication
        name={getString('connectors.GCR.stepTwoName')}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={isEditMode as boolean}
        connectorInfo={props.connectorInfo}
        setIsEditMode={setIsEditMode}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep={true}
        isLastStep={false}
        type={'Gcr'}
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

export default CreateGCRConnector
