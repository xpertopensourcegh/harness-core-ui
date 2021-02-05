import React, { useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import {
  Heading,
  Layout,
  StepProps,
  Text,
  Container,
  Formik,
  FormInput,
  FormikForm as Form,
  Button,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import { useCreateConnector } from 'services/cd-ng'
import { OPTIMIZATION_FEATURE, CROSS_ACCOUNT_ACCESS, FEATURES_ENABLED } from '../constants'
import type { feature } from '../constants'
import i18n from '../AWSCOConnector.i18n'
import css from './Steps.module.scss'

interface AWSCODetails {
  roleARN: string
  externalID: string
}

const ConnectionDetailsStep: React.FC<StepProps<ConnectorInfoDTO>> = props => {
  const { prevStepData, nextStep } = props
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const connectorInfo = prevStepData as ConnectorInfoDTO
  const [showRoleView, setShowRoleView] = useState(false)
  const [externalID, setExternalID] = useState(connectorInfo.spec.externalID as string)
  const [saving, setSaving] = useState(false)
  const { accountId } = useParams<{ accountId: string }>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })

  const createTemplate = (): void => {
    const curEnabled: boolean = connectorInfo.spec.billingPermission
    const optimizationEnabled: boolean = connectorInfo.spec.optimizationPermission
    const eventsEnabled: boolean = connectorInfo.spec.eventsPermission
    const url = `https://console.aws.amazon.com/cloudformation/home?#/stacks/quickcreate?stackName=harness-ce-iam-role-stack&templateURL=https://tests3utsav0.s3.amazonaws.com/stackTemplate2.yaml&param_ExternalId=${externalID}&param_CurEnabled=${curEnabled}&param_OptimizationEnabled=${optimizationEnabled}&param_EventsEnabled=${eventsEnabled}&param_BucketName=testS3BucketName`
    window.open(url)
  }

  const saveAndContinue = async (awsCoDetails: AWSCODetails): Promise<void> => {
    setSaving(true)
    const requiredFeatures: feature[] = []

    if (prevStepData?.spec?.optimizationPermission) {
      requiredFeatures.push(OPTIMIZATION_FEATURE)
      connectorInfo.spec[CROSS_ACCOUNT_ACCESS] = {
        crossAccountRoleArn: awsCoDetails.roleARN,
        externalId: awsCoDetails.externalID
      }
    }
    connectorInfo.spec[FEATURES_ENABLED] = requiredFeatures
    try {
      modalErrorHandler?.hide()
      const connector: ConnectorRequestBody = { connector: connectorInfo }
      await createConnector(connector)
      setSaving(false)
      nextStep?.(connectorInfo)
    } catch (e) {
      setSaving(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }
  return (
    <Formik
      initialValues={{ roleARN: connectorInfo.spec.roleARN, externalID: connectorInfo.spec.externalID }}
      validationSchema={Yup.object().shape({
        roleARN: Yup.string().trim().required(i18n.crossAccountRole.validation.arnRequired),
        externalID: Yup.string().trim().required(i18n.crossAccountRole.validation.extIDRequired)
      })}
      onSubmit={formData => {
        saveAndContinue(formData)
      }}
    >
      {() => (
        <Form>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Vertical spacing="large" className={css.containerLayout} padding="large">
            <Heading level={2} style={{ fontSize: '18px', color: 'grey800' }}>
              {i18n.crossAccountRole.title}
            </Heading>
            <Container padding={{ top: 'large', bottom: 'large' }}>
              <Text font={{ weight: 'bold' }}>{i18n.crossAccountRole.text}</Text>
              <Container background={'blue300'} padding={'large'} margin={{ top: 'medium' }}>
                <Text font="normal" style={{ lineHeight: '25px' }}>
                  {i18n.crossAccountRole.requirementExplanation}
                </Text>
              </Container>
            </Container>
            {!showRoleView && (
              <Container>
                <Button color="blue700" intent="primary" minimal onClick={() => setShowRoleView(true)}>
                  <Text font={{ weight: 'bold' }} color="blue700">
                    {i18n.crossAccountRole.instructionLabel}
                  </Text>
                </Button>
              </Container>
            )}
            {showRoleView && (
              <div>
                <FormInput.Text name="roleARN" label={i18n.crossAccountRole.arn} />
                <FormInput.Text
                  name="externalID"
                  label={i18n.crossAccountRole.externalID}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setExternalID(e.target.value)
                  }}
                />
                <Button
                  intent="primary"
                  minimal
                  text={i18n.crossAccountRole.templateLaunchText}
                  onClick={createTemplate}
                />
                <div>
                  <Button
                    intent="primary"
                    text={i18n.overview.submitText}
                    rightIcon="chevron-right"
                    disabled={saving}
                    loading={saving}
                    type="submit"
                  />
                </div>
              </div>
            )}
          </Layout.Vertical>
        </Form>
      )}
    </Formik>
  )
}

export default ConnectionDetailsStep
