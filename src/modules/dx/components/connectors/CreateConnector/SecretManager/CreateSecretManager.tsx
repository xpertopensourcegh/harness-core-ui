import React, { useState } from 'react'
import {
  StepWizard,
  Button,
  SelectOption,
  FormInput,
  StepProps,
  Container,
  Formik,
  FormikForm,
  Text
} from '@wings-software/uikit'
import * as Yup from 'yup'
// import type { IOptionProps } from '@blueprintjs/core'

import { VaultConfigDTO, useCreateSecretManager } from 'services/cd-ng'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useToaster } from 'modules/common/exports'
import { Connectors } from 'modules/dx/constants'

import i18n from './CreateSecretManager.i18n'

interface CreateSecretManagerProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal: () => void
}

const StepConnect: React.FC<StepProps<VaultConfigDTO>> = ({ prevStepData, nextStep }) => {
  const encryptionTypeOptions: SelectOption[] = [
    {
      label: 'HashiCorp Vault',
      value: 'VAULT'
    }
  ]
  // TODO: enable this once backend adds support
  // const authTypeOptions: IOptionProps[] = [
  //   {
  //     label: 'App Role',
  //     value: 'app_role'
  //   },
  //   {
  //     label: 'Token',
  //     value: 'token'
  //   }
  // ]

  return (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleConnect}
      </Text>
      <Formik<VaultConfigDTO>
        initialValues={{
          encryptionType: 'VAULT',
          vaultUrl: '',
          basePath: '',
          readOnly: false,
          default: false,
          // authType: 'token',
          authToken: ''
        }}
        validationSchema={Yup.object().shape({
          encryptionType: Yup.string().required(),
          vaultUrl: Yup.string().required(),
          authToken: Yup.string().required()
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, ...data })
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.Select name="encryptionType" label={i18n.labelEncType} items={encryptionTypeOptions} />
            <FormInput.Text name="vaultUrl" label={i18n.labelVaultUrl} />
            <FormInput.Text name="basePath" label={i18n.labelBaseSecretPath} />
            {/* <FormInput.RadioGroup
              name="authType"
              label="Authentication"
              radioGroup={{ inline: true }}
              items={authTypeOptions}
            /> */}
            {/* <FormInput.Text name="appRoleId" label="App Role ID" /> */}
            {/* <FormInput.Text name="secretId" label="Secret ID" /> */}
            <FormInput.Text name="authToken" label={i18n.labelToken} inputGroup={{ type: 'password' }} />
            <FormInput.CheckBox name="readOnly" label={i18n.labelReadOnly} padding={{ left: 'xxlarge' }} />
            <FormInput.CheckBox name="default" label={i18n.labelDefault} padding={{ left: 'xxlarge' }} />
            <Button type="submit" intent="primary" text={i18n.buttonNext} />
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

const StepSecretEngine: React.FC<StepProps<VaultConfigDTO>> = ({ nextStep, prevStepData }) => {
  return (
    <Container padding={{ top: 'xxxlarge' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleSecretEngine}
      </Text>
      <Formik<VaultConfigDTO>
        initialValues={{
          secretEngineName: '',
          renewIntervalHours: undefined
        }}
        validationSchema={Yup.object().shape({
          secretEngineName: Yup.string().required(),
          renewIntervalHours: Yup.number().positive().required()
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, ...data })
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.Text name="secretEngineName" label={i18n.labelSecretEngine} />
            <FormInput.Text name="renewIntervalHours" label={i18n.labelRenewal} />
            <Button type="submit" intent="primary" text={i18n.buttonSubmit} />
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

const CreateSecretManager: React.FC<CreateSecretManagerProps> = ({
  accountId,
  orgIdentifier,
  projectIdentifier,
  hideLightModal
}) => {
  const [formData, setFormData] = useState<VaultConfigDTO>()
  const { showSuccess } = useToaster()
  const { mutate: createSecretManager } = useCreateSecretManager({})

  return (
    <Container height="100%">
      <StepWizard<VaultConfigDTO>
        onCompleteWizard={async data => {
          if (data) {
            data['accountIdentifier'] = accountId
            try {
              await createSecretManager(data)
              showSuccess(i18n.messageSuccess)
              hideLightModal()
            } catch (err) {
              // handle error
            }
          }
        }}
      >
        <ConnectorDetailsStep
          accountId={accountId}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          type={Connectors.SECRET_MANAGER}
          name={i18n.titleSecretManager}
          setFormData={setFormData}
          formData={formData}
        />
        <StepConnect name={i18n.nameStepConnect} />
        <StepSecretEngine name={i18n.nameStepSecretEngine} />
      </StepWizard>
    </Container>
  )
}

export default CreateSecretManager
