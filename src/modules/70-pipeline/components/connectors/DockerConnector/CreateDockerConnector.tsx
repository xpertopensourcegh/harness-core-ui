import React, { useState } from 'react'
import * as Yup from 'yup'
import {
  StepWizard,
  Layout,
  Button,
  Formik,
  FormInput,
  FormikForm as Form,
  StepProps,
  Color
} from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'

import type { ConnectorConfigDTO, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepDockerAuthentication from '@connectors/components/CreateConnector/DockerConnector/StepAuth/StepDockerAuthentication'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import i18n from './CreateDockerConnector.i18n'
import css from './DockerConnector.module.scss'
interface CreateDockerConnectorProps {
  hideLightModal: () => void
  handleSubmit: (data: { connectorId: { value: string }; imagePath: string }) => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode?: boolean
  connectorInfo?: ConnectorInfoDTO | void
}

interface StepDockerAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

const DockerImagePathSelection: React.FC<
  StepProps<StepDockerAuthenticationProps> & {
    handleSubmit: (data: { connectorId: { value: string }; imagePath: string }) => void
  }
> = props => {
  const { prevStepData } = props

  return (
    <Layout.Vertical height={'inherit'} data-id={name}>
      <div className={css.heading}>{i18n.STEP_TWO.Heading}</div>
      <Formik
        initialValues={{ imagePath: '' }}
        validationSchema={Yup.object().shape({
          imagePath: Yup.string().trim().required()
        })}
        onSubmit={formData => {
          const dataToSubmit = {
            connectorId: { value: prevStepData?.identifier || '' },
            imagePath: formData.imagePath
          }
          props.handleSubmit(dataToSubmit)
        }}
      >
        {() => (
          <Form>
            <FormInput.MultiTextInput
              label={i18n.STEP_FOUR.imageName}
              name="imagePath"
              placeholder={i18n.STEP_FOUR.imageNamePlaceholder}
            />

            <Button intent="primary" type="submit" text={i18n.STEP_FOUR.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  const { getString } = useStrings()

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
        name={getString('connectors.docker.stepTwoName')}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={isEditMode as boolean}
        connectorInfo={props.connectorInfo}
        setIsEditMode={setIsEditMode}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep={true}
        isLastStep={false}
        type={Connectors.DOCKER}
      />

      <DockerImagePathSelection name={getString('connectors.stepFourName')} handleSubmit={props.handleSubmit} />
    </StepWizard>
  )
}

export default CreateDockerConnector
