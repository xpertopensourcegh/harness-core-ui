import React, { useState } from 'react'
import { StepWizard, SelectOption } from '@wings-software/uikit'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import { Connectors } from 'modules/dx/constants'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import ConnectionModeStep from './ConnectionModeStep/ConnectionModeStep'
import HttpCredendialStep from './HTTP/HttpCredendialStep'
import i18n from './CreateGITConnector.i18n'

interface CreateGITConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
}
const CreateGITConnector = (props: CreateGITConnectorProps) => {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const [connectType, setConnectType] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          type={Connectors.GIT}
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />
        <ConnectionModeStep
          type={Connectors.GIT}
          name={i18n.STEP_TWO.NAME}
          setFormData={setFormData}
          formData={formData}
          connectType={connectType}
          setConnectType={setConnectType}
        />
        {connectType.value === 'Http' ? (
          <HttpCredendialStep
            name={i18n.STEP_THREE.NAME}
            setFormData={setFormData}
            formData={formData}
            {...props}
            isEditMode={isEditMode}
          />
        ) : null}
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_VERIFY.NAME}
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          connectorName={formData?.name}
          connectorIdentifier={formData?.identifier}
          setIsEditMode={() => setIsEditMode(true)}
          renderInModal={true}
        />
      </StepWizard>
    </>
  )
}

export default CreateGITConnector
