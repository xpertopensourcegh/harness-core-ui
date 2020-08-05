import React, { useState } from 'react'
import { StepWizard, Button, SelectOption } from '@wings-software/uikit'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { GITFormData } from 'modules/dx/interfaces/ConnectorInterface'
import i18n from './CreateGITConnector.i18n'
import ConnectionModeStep from './ConnectionModeStep/ConnectionModeStep'
import HttpCredendialStep from './HTTP/HttpCredendialStep'

// interface CreateGITConnectorState {
//   formData: GITFormData
//   setFormData: (data: GITFormData) => void
// }

interface CreateGITConnectorProps {
  accountId: string
  hideLightModal: () => void
}
const CreateGITConnector = (props: CreateGITConnectorProps) => {
  const [formData, setFormData] = useState<GITFormData | undefined>()
  const [connectType, setConnectType] = useState({ label: 'HTTP', value: 'Http' } as SelectOption)
  // const state: CreateGITConnectorState = {
  //   formData,
  //   setFormData
  // }

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          accountId={props.accountId}
          type={i18n.type}
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />
        <ConnectionModeStep
          type={i18n.type}
          name={i18n.STEP_TWO.NAME}
          setFormData={setFormData}
          formData={formData}
          setConnectType={setConnectType}
        />
        {connectType.value === 'Http' ? (
          <HttpCredendialStep name={i18n.STEP_THREE.NAME} setFormData={setFormData} formData={formData} {...props} />
        ) : null}
      </StepWizard>
      <Button text="close" />
    </>
  )
}

export default CreateGITConnector
