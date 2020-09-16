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
import { pick } from 'lodash-es'
import type { IOptionProps } from '@blueprintjs/core'

import { VaultConfigDTO, useCreateConnector, ConnectorRequestDTO } from 'services/cd-ng'
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
      value: 'Vault'
    }
  ]
  const authTypeOptions: IOptionProps[] = [
    {
      label: 'App Role',
      value: 'appRoleId'
    },
    {
      label: 'Token',
      value: 'token'
    }
  ]

  return (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleConnect}
      </Text>
      <Formik
        initialValues={{
          encryptionType: 'VAULT', // TODO {Abhinav} fix type once backend send it
          vaultUrl: '',
          basePath: '',
          readOnly: false,
          default: false,
          authType: 'appRoleId',
          authToken: ''
        }}
        validationSchema={Yup.object().shape({
          encryptionType: Yup.string().required(i18n.validationEncType),
          vaultUrl: Yup.string().required(i18n.validationVaultUrl),
          authToken: Yup.string().when('authType', {
            is: 'token',
            then: Yup.string().required(i18n.validationAuthToken)
          }),
          appRoleId: Yup.string().when('authType', {
            is: 'appRoleId',
            then: Yup.string().required(i18n.validationAppRole)
          }),
          secretId: Yup.string().when('authType', {
            is: 'appRoleId',
            then: Yup.string().required(i18n.validationSecretId)
          })
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, ...data } as any) // TODO {Abhinav} remove any once vault refactored
        }}
      >
        {formikProps => (
          <FormikForm>
            <FormInput.Select name="encryptionType" label={i18n.labelEncType} items={encryptionTypeOptions} />
            <FormInput.Text name="vaultUrl" label={i18n.labelVaultUrl} />
            <FormInput.Text name="basePath" label={i18n.labelBaseSecretPath} />
            <FormInput.RadioGroup
              name="authType"
              label={i18n.labelAuth}
              radioGroup={{ inline: true }}
              items={authTypeOptions}
            />
            {formikProps.values['authType'] === 'appRoleId' ? (
              <>
                <FormInput.Text name="appRoleId" label={i18n.labelAppRoleId} />
                <FormInput.Text name="secretId" label={i18n.labelSecretId} />
              </>
            ) : (
              <FormInput.Text name="authToken" label={i18n.labelToken} inputGroup={{ type: 'password' }} />
            )}
            <FormInput.CheckBox name="readOnly" label={i18n.labelReadOnly} padding={{ left: 'xxlarge' }} />
            <FormInput.CheckBox name="default" label={i18n.labelDefault} padding={{ left: 'xxlarge' }} />
            <Button type="submit" intent="primary" text={i18n.buttonNext} />
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

const StepSecretEngine: React.FC<StepProps<VaultConfigDTO> & { loading: boolean }> = ({
  nextStep,
  prevStepData,
  loading
}) => {
  return (
    <Container padding={{ top: 'xxxlarge' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleSecretEngine}
      </Text>
      <Formik
        initialValues={{
          secretEngineName: '',
          renewIntervalHours: undefined
        }}
        validationSchema={Yup.object().shape({
          secretEngineName: Yup.string().required(i18n.validationEngine),
          renewIntervalHours: Yup.number().positive(i18n.validationRenewalNumber).required(i18n.validationRenewal)
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, ...data } as any)
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.Text name="secretEngineName" label={i18n.labelSecretEngine} />
            <FormInput.Text name="renewIntervalHours" label={i18n.labelRenewal} />
            <Button
              type="submit"
              intent="primary"
              text={loading ? i18n.buttonSaving : i18n.buttonSubmit}
              disabled={loading}
            />
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
  const [formData, setFormData] = useState<VaultConfigDTO | undefined>()
  const { showSuccess } = useToaster()
  const { mutate: createSecretManager, loading } = useCreateConnector({ accountIdentifier: accountId })

  return (
    <Container height="100%">
      <StepWizard<VaultConfigDTO>
        onCompleteWizard={async data => {
          if (data) {
            const dataToSubmit: ConnectorRequestDTO = {
              orgIdentifier,
              projectIdentifier,
              ...pick(data, ['name', 'identifier', 'description', 'tags']),
              type: 'Vault',
              spec: {
                ...pick(data, ['authToken', 'basePath', 'secretEngineName', 'vaultUrl', 'readOnly', 'default'])
              }
            }

            try {
              await createSecretManager(dataToSubmit)
              showSuccess(i18n.messageSuccess)
              hideLightModal()
            } catch (err) {
              // handle error
            }
          }
        }}
      >
        <ConnectorDetailsStep
          type={Connectors.SECRET_MANAGER}
          name={i18n.titleSecretManager}
          setFormData={data => setFormData(data as VaultConfigDTO)}
          formData={formData}
        />
        <StepConnect name={i18n.nameStepConnect} />
        <StepSecretEngine name={i18n.nameStepSecretEngine} loading={loading} />
      </StepWizard>
    </Container>
  )
}

export default CreateSecretManager
