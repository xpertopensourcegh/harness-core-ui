import React from 'react'
import * as Yup from 'yup'
import { StepWizard, Layout, Button, Formik, FormInput, FormikForm as Form, StepProps } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'

import type { ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepDockerAuthentication from '@connectors/components/CreateConnector/DockerConnector/StepAuth/StepDockerAuthentication'
import i18n from './CreateDockerConnector.i18n'
import css from './DockerConnector.module.scss'
interface CreateDockerConnectorProps {
  hideLightModal: () => void
  handleSubmit: (data: { connectorId: { value: string }; imagePath: string }) => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
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

const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = p => {
  return (
    <section className={css.wrapper}>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.DOCKER} name={i18n.STEP_ONE.NAME} />
        <StepDockerAuthentication
          name={i18n.STEP_TWO.NAME}
          isEditMode={false}
          connectorInfo={undefined}
          setIsEditMode={() => undefined}
        />

        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          renderInModal={true}
          setIsEditMode={() => undefined}
          onSuccess={() => {
            // Handle on success
          }}
          isLastStep={false}
          type={Connectors.DOCKER}
        />
        <DockerImagePathSelection name={i18n.STEP_FOUR.name} handleSubmit={p.handleSubmit} />
      </StepWizard>
    </section>
  )
}

export default CreateDockerConnector
