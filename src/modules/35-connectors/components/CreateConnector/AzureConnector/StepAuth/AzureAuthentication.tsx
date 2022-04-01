/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useState, useEffect } from 'react'
import { FontVariation } from '@harness/design-system'
import {
  Layout,
  Button,
  Formik,
  Text,
  StepProps,
  Container,
  PageSpinner,
  ThumbnailSelect,
  FormInput,
  SelectOption,
  ButtonVariation
} from '@wings-software/uicore'
import cx from 'classnames'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import type { ConnectorConfigDTO, ConnectorInfoDTO } from 'services/cd-ng'
import {
  DelegateTypes,
  DelegateCardInterface,
  setupAzureFormData,
  AzureSecretKeyType,
  AzureManagedIdentityTypes
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import type { AzureFormInterface } from '@connectors/interfaces/ConnectorInterface'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import { useStrings } from 'framework/strings'
import commonStyles from '@connectors/components/CreateConnector/commonSteps/ConnectorCommonStyles.module.scss'
import css from '../CreateAzureConnector.module.scss'

interface AzureAuthenticationProps {
  name: string
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  setFormData?: (formData: ConnectorConfigDTO) => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
  connectorInfo?: ConnectorInfoDTO | void
}

interface StepConfigureProps {
  closeModal?: () => void
  onSuccess?: () => void
}

const AzureAuthentication: React.FC<StepProps<StepConfigureProps> & AzureAuthenticationProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId } = useParams<AccountPathProps>()
  const { getString } = useStrings()

  const environments = {
    AZURE_GLOBAL: 'AZURE_GLOBAL',
    US_GOVERNMENT: 'AZURE_US_GOVERNMENT'
  }

  const environmentOptions: SelectOption[] = [
    { label: getString('connectors.azure.environments.azureGlobal'), value: environments.AZURE_GLOBAL },
    { label: getString('connectors.azure.environments.usGov'), value: environments.US_GOVERNMENT }
  ]

  const DelegateCards: DelegateCardInterface[] = [
    {
      type: DelegateTypes.DELEGATE_OUT_CLUSTER,
      info: getString('connectors.GCP.delegateOutClusterInfo')
    },
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('connectors.azure.delegateInClusterInfo')
    }
  ]

  const secretKeyOptions: SelectOption[] = [
    {
      label: getString('connectors.azure.auth.secret'),
      value: AzureSecretKeyType.SECRET
    },
    {
      label: getString('connectors.azure.auth.certificate'),
      value: AzureSecretKeyType.CERT
    }
  ]

  const managedIdentityOptions = [
    {
      label: getString('connectors.azure.managedIdentities.systemAssigned'),
      value: AzureManagedIdentityTypes.SYSTEM_MANAGED
    },
    {
      label: getString('connectors.azure.managedIdentities.userAssigned'),
      value: AzureManagedIdentityTypes.USER_MANAGED
    }
  ]

  const defaultInitialFormData: AzureFormInterface = {
    authType: undefined,
    azureEnvironmentType: environments.AZURE_GLOBAL,
    applicationId: undefined,
    tenantId: undefined,
    secretType: AzureSecretKeyType.SECRET,
    secretText: undefined,
    secretFile: undefined,
    clientId: undefined,
    managedIdentity: AzureManagedIdentityTypes.SYSTEM_MANAGED
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(props.isEditMode)

  useEffect(() => {
    if (loadingConnectorSecrets && props.isEditMode) {
      /* istanbul ignore else */
      if (props.connectorInfo) {
        setupAzureFormData(props.connectorInfo, accountId).then(data => {
          setInitialValues(data as AzureFormInterface)
          setLoadingConnectorSecrets(false)
        })
      } else {
        setLoadingConnectorSecrets(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingConnectorSecrets])

  const handleSubmit = (formData: ConnectorConfigDTO): void => {
    nextStep?.({ ...props.connectorInfo, ...prevStepData, ...formData } as StepConfigureProps)
  }

  const resetSecretType = (formik: FormikProps<ConnectorConfigDTO>, value: string): void => {
    switch (value) {
      case AzureSecretKeyType.SECRET:
        formik.setFieldValue('secretText', undefined)
        return
      case AzureSecretKeyType.CERT:
        formik.setFieldValue('secretFile', undefined)
        return
    }
  }

  const resetManagedIdenity = (formik: FormikProps<ConnectorConfigDTO>, value: string): void => {
    if (value === AzureManagedIdentityTypes.SYSTEM_MANAGED) {
      formik.setFieldValue('clientId', '')
    }
  }

  return loadingConnectorSecrets ? (
    <PageSpinner />
  ) : (
    <Layout.Vertical spacing="medium" className={css.secondStep}>
      <Text font={{ variation: FontVariation.H3 }}>{getString('details')}</Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...props.prevStepData
        }}
        formName="azureAuthForm"
        validationSchema={Yup.object().shape({
          authType: Yup.string().required(getString('connectors.chooseMethodForAzureConnection')),
          azureEnvironmentType: Yup.string().required(getString('connectors.azure.validation.environment')),
          applicationId: Yup.string().when('authType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string()
              .required(getString('connectors.azure.validation.applicationId'))
              .matches(/^(\w+\S+)$/, getString('connectors.azure.validation.applicationIdRegex'))
          }),
          tenantId: Yup.string().when('authType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string()
              .required(getString('connectors.tenantIdRequired'))
              .matches(/^(\w+\S+)$/, getString('connectors.azure.validation.tenantIdRegex'))
          }),
          secretType: Yup.string().when('authType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string().required(getString('connectors.tenantIdRequired'))
          }),
          secretText: Yup.object().when(['authType', 'secretType'], {
            is: (authType, secretType) =>
              authType === DelegateTypes.DELEGATE_OUT_CLUSTER && secretType === AzureSecretKeyType.SECRET,
            then: Yup.object().required(getString('connectors.azure.validation.secret'))
          }),
          secretFile: Yup.object().when(['authType', 'secretType'], {
            is: (authType, secretType) =>
              authType === DelegateTypes.DELEGATE_OUT_CLUSTER && secretType === AzureSecretKeyType.CERT,
            then: Yup.object().required(getString('connectors.azure.validation.certificate'))
          }),
          managedIdentity: Yup.string().when('authType', {
            is: DelegateTypes.DELEGATE_IN_CLUSTER,
            then: Yup.string().required('connectors.azure.validation.managedIdentity')
          }),
          clientId: Yup.string().when(['authType', 'managedIdentity'], {
            is: (authType, managedIdentity) =>
              authType === DelegateTypes.DELEGATE_IN_CLUSTER &&
              managedIdentity === AzureManagedIdentityTypes.USER_MANAGED,
            then: Yup.string()
              .required(getString('connectors.azure.validation.clientId'))
              .matches(/^(\w+\S+)$/, getString('connectors.azure.validation.clientIdRegex'))
          })
        })}
        onSubmit={handleSubmit}
      >
        {formikProps => (
          <>
            <Container className={css.wrapper}>
              <ThumbnailSelect
                items={DelegateCards.map(card => ({ label: card.info, value: card.type }))}
                name="authType"
                size="large"
                onChange={
                  /* istanbul ignore next */ type => {
                    formikProps.setValues({ ...defaultInitialFormData })
                    formikProps?.setFieldValue('authType', type)
                  }
                }
              />
              {DelegateTypes.DELEGATE_OUT_CLUSTER === formikProps.values.authType ? (
                <Layout.Vertical className={css.detailsWrapper}>
                  <FormInput.Select
                    name="azureEnvironmentType"
                    label={getString('environment')}
                    items={environmentOptions}
                  />
                  <FormInput.Text
                    name={'applicationId'}
                    placeholder={getString('connectors.azure.applicationId')}
                    label={getString('connectors.azure.applicationId')}
                  />
                  <FormInput.Text
                    name={'tenantId'}
                    placeholder={getString('connectors.tenantId')}
                    label={getString('connectors.tenantId')}
                  />
                  <Container className={css.authHeaderRow}>
                    <Text
                      font={{ variation: FontVariation.H6 }}
                      tooltipProps={{ dataTooltipId: 'azureCredentialsAuthTooltip' }}
                      inline
                    >
                      {getString('authentication')}
                    </Text>
                    <FormInput.Select
                      name="secretType"
                      items={secretKeyOptions}
                      disabled={false}
                      className={commonStyles.authTypeSelect}
                      onChange={/* istanbul ignore next */ ({ value }) => resetSecretType(formikProps, value as string)}
                    />
                  </Container>
                  {formikProps.values.secretType === AzureSecretKeyType.SECRET && (
                    <SecretInput name={'secretText'} label={getString('connectors.azure.auth.secret')} />
                  )}
                  {formikProps.values.secretType === AzureSecretKeyType.CERT && (
                    <SecretInput
                      name={'secretFile'}
                      label={getString('connectors.azure.auth.certificate')}
                      type={'SecretFile'}
                    />
                  )}
                </Layout.Vertical>
              ) : null}
              {DelegateTypes.DELEGATE_IN_CLUSTER === formikProps.values.authType ? (
                <Layout.Vertical className={css.detailsWrapper}>
                  <FormInput.Select
                    name="azureEnvironmentType"
                    label={getString('environment')}
                    items={environmentOptions}
                  />
                  <Container className={css.authHeaderRow}>
                    <Text
                      font={{ variation: FontVariation.H6 }}
                      tooltipProps={{ dataTooltipId: 'azureManagedIdentityAuthTooltip' }}
                      inline
                    >
                      {getString('authentication')}
                    </Text>
                    <FormInput.Select
                      name="managedIdentity"
                      items={managedIdentityOptions}
                      disabled={false}
                      className={cx(commonStyles.authTypeSelect, css.authSelect)}
                      onChange={
                        /* istanbul ignore next */ ({ value }) => resetManagedIdenity(formikProps, value as string)
                      }
                    />
                  </Container>
                  {formikProps.values.managedIdentity === AzureManagedIdentityTypes.USER_MANAGED && (
                    <FormInput.Text
                      name={'clientId'}
                      placeholder={getString('connectors.azure.clientId')}
                      label={getString('connectors.azure.clientId')}
                    />
                  )}
                </Layout.Vertical>
              ) : null}
            </Container>
            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button
                text={getString('back')}
                icon="chevron-left"
                variation={ButtonVariation.SECONDARY}
                onClick={() => props?.previousStep?.(props?.prevStepData)}
              />
              <Button
                type="submit"
                variation={ButtonVariation.PRIMARY}
                onClick={formikProps.submitForm}
                text={getString('continue')}
                rightIcon="chevron-right"
              />
            </Layout.Horizontal>
          </>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default AzureAuthentication
