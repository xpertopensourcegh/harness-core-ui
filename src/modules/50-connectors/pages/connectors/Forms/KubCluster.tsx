import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import cx from 'classnames'
import * as Yup from 'yup'
import { Formik, FormikForm as Form, FormInput, Layout, SelectV2, Button, Text } from '@wings-software/uikit'
import { CardSelect, Icon } from '@wings-software/uikit'
import ConnectorFormFields from '@connectors/components/ConnectorFormFields/ConnectorFormFields'
import { useGetKubernetesDelegateNames } from 'services/portal'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import type { InlineSecret } from '@secrets/components/CreateInlineSecret/CreateInlineSecret'
import { getSecretV2Promise, SecretTextSpecDTO, ResponseSecretResponseWrapper } from 'services/cd-ng'
import { Scope } from '@common/interfaces/SecretsInterface'
import useCreateUpdateSecretModal from '@secrets/modals/CreateSecretModal/useCreateUpdateSecretModal'
import { DelegateTypes } from './KubeFormInterfaces'

import { authOptions, DelegateInClusterType, getIconsForCard } from './KubeFormHelper'
import { AuthTypes, getLabelForAuthType } from '../utils/ConnectorHelper'
import { buildKubFormData, buildKubPayload, getSecretIdFromString, getScopeFromString } from '../utils/ConnectorUtils'

import i18n from './KubCluster.i18n'
import css from './KubCluster.module.scss'

interface SelectedDelegate {
  type: string
  value: string
  icon: string
}
interface KubClusterProps {
  enableEdit?: boolean
  connector: ConnectorInfoDTO
  setConnector: (data: ConnectorInfoDTO) => void
  setConnectorForYaml: (data: ConnectorInfoDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorRequestBody) => void
}

const delegateData = [
  {
    type: DelegateTypes.DELEGATE_IN_CLUSTER,
    value: i18n.DELEGATE_IN_CLUSTER_TEXT,
    icon: 'blank'
  },
  {
    type: DelegateTypes.DELEGATE_OUT_CLUSTER,
    value: i18n.DELEGATE_OUT_CLUSTER_TEXT,
    icon: 'blank'
  }
]

const formatDelegateList = (listData: string[] | undefined) => {
  return listData?.map((item: string) => {
    return { label: item || '', value: item || '' }
  })
}

const KubCluster: React.FC<KubClusterProps> = props => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { loading, data: delegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId }
  })
  const { openCreateSecretModal } = useCreateUpdateSecretModal({})
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const { connector } = props

  const [secretData, setSecretData] = useState<ResponseSecretResponseWrapper>()

  const [passwordRefSecret, setPasswordRefSecret] = useState<InlineSecret>()
  const [serviceAccountTokenRefSecret, setServiceAccountTokenRefSecret] = useState<InlineSecret>()
  const [oidcPasswordRefSecret, setOidcPasswordRefSecret] = useState<InlineSecret>()
  const [oidcClientIdRefSecret, setOidcClientIdRefSecret] = useState<InlineSecret>()
  const [oidcSecretRefSecret, setOidcSecretRefSecret] = useState<InlineSecret>()
  const [clientCertRefSecret, setClientCertRefSecret] = useState<InlineSecret>()
  const [clientKeyRefSecret, setClientKeyRefSecret] = useState<InlineSecret>()
  const [clientKeyPassphraseRefSecret, setCientKeyPassphraseRefSecret] = useState<InlineSecret>()
  const [caCertRefSecret, setCaCertRefSecret] = useState<InlineSecret>()

  const kubFormData = buildKubFormData(connector)

  const getSecretForValue = async (value: string, setSecretField: (val: InlineSecret) => void): Promise<void> => {
    const secretId = getSecretIdFromString(value)
    const secretScope = getScopeFromString(value)
    const data = await getSecretV2Promise({
      identifier: secretId,
      queryParams: {
        accountIdentifier: accountId,
        orgIdentifier: secretScope === Scope.ORG || secretScope === Scope.PROJECT ? orgIdentifier : undefined,
        projectIdentifier: secretScope === Scope.PROJECT ? projectIdentifier : undefined
      }
    })

    const secretManagerIdentifier = (data.data?.secret?.spec as SecretTextSpecDTO)?.secretManagerIdentifier
    setSecretData(data)
    setSecretField({
      secretId,
      secretName: data.data?.secret?.name || '',
      secretManager: {
        label: secretManagerIdentifier,
        value: secretManagerIdentifier
      },
      scope: Scope.ACCOUNT
    })
  }
  const getSecrets = (formData: any) => {
    if (formData.passwordRef) {
      getSecretForValue(formData.passwordRef, setPasswordRefSecret)
    }
    if (formData.serviceAccountTokenRef) {
      getSecretForValue(formData.serviceAccountTokenRef, setServiceAccountTokenRefSecret)
    }
    if (formData.oidcPasswordRef) {
      getSecretForValue(formData.oidcPasswordRef, setOidcPasswordRefSecret)
    }
    if (formData.oidcClientIdRef) {
      getSecretForValue(formData.oidcClientIdRef, setOidcClientIdRefSecret)
    }
    if (formData.oidcSecretRef) {
      getSecretForValue(formData.oidcSecretRef, setOidcSecretRefSecret)
    }
    if (formData.clientCertRef) {
      getSecretForValue(formData.clientCertRef, setClientCertRefSecret)
    }
    if (formData.clientKeyRef) {
      getSecretForValue(formData.clientKeyRef, setClientKeyRefSecret)
    }
    if (formData.clientKeyPassphraseRef) {
      getSecretForValue(formData.clientKeyPassphraseRef, setCientKeyPassphraseRefSecret)
    }
    if (formData.caCertRef) {
      getSecretForValue(formData.caCertRef, setCaCertRefSecret)
    }
  }

  const getSecretFieldsForAuthType = () => {
    let secretsInfo = {}
    if (kubFormData.passwordRef) {
      secretsInfo = {
        ...secretsInfo,
        passwordRef: { value: getSecretIdFromString(kubFormData.passwordRef), isReference: true }
      }
    }
    if (kubFormData.serviceAccountTokenRef) {
      secretsInfo = {
        ...secretsInfo,
        serviceAccountTokenRef: { value: getSecretIdFromString(kubFormData.serviceAccountTokenRef), isReference: true }
      }
    }
    if (kubFormData.oidcPasswordRef) {
      secretsInfo = {
        ...secretsInfo,
        oidcPasswordRef: { value: getSecretIdFromString(kubFormData.oidcPasswordRef), isReference: true }
      }
    }
    if (kubFormData.oidcClientIdRef) {
      secretsInfo = {
        ...secretsInfo,
        oidcClientIdRef: { value: getSecretIdFromString(kubFormData.oidcClientIdRef), isReference: true }
      }
    }
    if (kubFormData.oidcSecretRef) {
      secretsInfo = {
        ...secretsInfo,
        oidcSecretRef: { value: getSecretIdFromString(kubFormData.oidcSecretRef), isReference: true }
      }
    }
    if (kubFormData.clientCertRef) {
      secretsInfo = {
        ...secretsInfo,
        clientCertRef: { value: getSecretIdFromString(kubFormData.clientCertRef), isReference: true }
      }
    }
    if (kubFormData.clientKeyRef) {
      secretsInfo = {
        ...secretsInfo,
        clientKeyRef: { value: getSecretIdFromString(kubFormData.clientKeyRef), isReference: true }
      }
    }
    if (kubFormData.clientKeyPassphraseRef) {
      secretsInfo = {
        ...secretsInfo,
        clientKeyPassphraseRef: { value: getSecretIdFromString(kubFormData.clientKeyPassphraseRef), isReference: true }
      }
    }
    if (kubFormData.caCertRef) {
      secretsInfo = {
        ...secretsInfo,
        caCertRef: { value: getSecretIdFromString(kubFormData.caCertRef), isReference: true }
      }
    }

    return secretsInfo
  }

  useEffect(() => {
    if (connector && connector.spec?.credential?.type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
      const formData = buildKubFormData(connector)
      getSecrets(formData)
    }
  }, [])

  useEffect(() => {
    if (connector?.spec?.credential?.type === DelegateTypes.DELEGATE_IN_CLUSTER) {
      setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
    }
  }, [props])
  const delegateListFiltered = formatDelegateList(delegateList?.resource) || [{ label: '', value: '' }]

  const initialFormData = { ...kubFormData, ...getSecretFieldsForAuthType() }
  const initialValues = {
    ...initialFormData,
    passwordRefSecret,
    serviceAccountTokenRefSecret,
    oidcPasswordRefSecret,
    oidcClientIdRefSecret,
    oidcSecretRefSecret,
    clientCertRefSecret,
    clientKeyRefSecret,
    clientKeyPassphraseRefSecret,
    caCertRefSecret,
    authType: kubFormData.authType || '',
    delegateType: kubFormData.delegateType || ''
  }
  return (
    <Formik
      initialValues={{
        ...initialValues
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.validation.name),
        description: Yup.string(),
        delegateName: Yup.string().when('delegateType', {
          is: DelegateTypes.DELEGATE_IN_CLUSTER,
          then: Yup.string().trim().required(i18n.validation.delegate)
        }),
        masterUrl: Yup.string()
          .nullable()
          .when('delegateType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string().trim().required(i18n.validation.masterUrl)
          }),
        passwordRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.USER_PASSWORD,
          then: Yup.string().trim().required(i18n.validation.passwordRef)
        }),
        username: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.USER_PASSWORD,
          then: Yup.string().trim().required(i18n.validation.username)
        }),
        serviceAccountTokenRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.SERVICE_ACCOUNT,
          then: Yup.string().trim().required(i18n.validation.serviceAccountTokenRef)
        }),
        oidcIssuerUrl: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.OIDC,
          then: Yup.string().trim().required(i18n.validation.oidcIssueUrl)
        }),
        oidcUsername: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.OIDC,
          then: Yup.string().trim().required(i18n.validation.username)
        }),
        oidcPasswordRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.OIDC,
          then: Yup.string().trim().required(i18n.validation.oidcPasswordRef)
        }),
        oidcClientIdRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.OIDC,
          then: Yup.string().trim().required(i18n.validation.oidcClientIdRef)
        }),
        clientCertRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.CLIENT_KEY_CERT,
          then: Yup.string().trim().required(i18n.validation.clientCertRef)
        }),
        clientKeyRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.CLIENT_KEY_CERT,
          then: Yup.string().trim().required(i18n.validation.clientKeyRef)
        }),
        clientKeyPassphraseRef: Yup.string().when(['delegateType', 'authType'], {
          is: (delegateType, authType) =>
            delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER && authType === AuthTypes.CLIENT_KEY_CERT,
          then: Yup.string().trim().required(i18n.validation.clientKeyPassphraseRef)
        })
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        const connectorData = {
          ...formData,

          projectIdentifier: projectIdentifier,
          orgIdentifier: orgIdentifier
        }

        props.onSubmit(buildKubPayload(connectorData))
      }}
      validate={data => {
        props.setConnectorForYaml(buildKubPayload(data).connector)
      }}
    >
      {formikProps => (
        <Form>
          <div className={css.formCustomCss}>
            <FormInput.InputWithIdentifier isIdentifierEditable={false} />
            <FormInput.TextArea label={i18n.description} name="description" className={css.description} />
            <FormInput.TagInput
              name="tags"
              label={i18n.tags}
              items={connector?.tags || []}
              labelFor={name => (typeof name === 'string' ? name : '')}
              itemFromNewTag={newTag => newTag}
              tagInputProps={{
                noInputBorder: true,
                openOnKeyDown: false,
                showAddTagButton: true,
                showClearAllButton: true,
                allowNewTag: true,
                placeholder: i18n.enterTags
              }}
            />
            <CardSelect
              data={delegateData}
              className={css.delegateSetup}
              renderItem={function renderItem(item: any) {
                return (
                  <div
                    className={cx(css.cardCss, { [css.selectedCard]: item.type === formikProps.values?.delegateType })}
                  >
                    <div className={css.cardContent}>
                      {item.value}
                      {getIconsForCard(item.type, item.type === formikProps.values?.delegateType)}
                    </div>
                    {item.type === formikProps.values?.delegateType ? (
                      <Icon name="deployment-success-new" size={16} className={css.tickWrp} />
                    ) : null}
                  </div>
                )
              }}
              onChange={(item: SelectedDelegate) => {
                formikProps.setFieldValue('delegateType', item.type)
              }}
              selected={formikProps.values?.delegateType}
            />
            {formikProps.values?.delegateType === DelegateTypes.DELEGATE_IN_CLUSTER && !loading ? (
              <div className={css.incluster}>
                <div
                  className={css.radioOption}
                  onClick={() => {
                    setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
                  }}
                >
                  <input type="radio" checked={inclusterDelegate === DelegateInClusterType.useExistingDelegate} />
                  <Text margin={{ left: 'large' }}>{i18n.useExistingDelegate}</Text>
                </div>
                {inclusterDelegate === DelegateInClusterType.useExistingDelegate ? (
                  <FormInput.Select name="delegateName" label={i18n.selectDelegate} items={delegateListFiltered} />
                ) : null}
                <div
                  className={css.radioOptionInstall}
                  onClick={() => {
                    setInClusterDelegate(DelegateInClusterType.addNewDelegate)
                  }}
                >
                  <input type="radio" checked={inclusterDelegate === DelegateInClusterType.addNewDelegate} />
                  <Text margin={{ left: 'large' }}>{i18n.addNewDelegate}</Text>
                </div>
              </div>
            ) : null}
            {formikProps.values?.delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
              <div className={css.delgateOutCluster}>
                <FormInput.Text label={i18n.masterUrl} name="masterUrl" />
                <Layout.Horizontal className={css.credWrapper}>
                  <div className={css.label}>
                    <Icon name="lock" size={14} className={css.lockIcon} />
                    {i18n.credentials}
                  </div>
                  <SelectV2
                    items={authOptions}
                    value={{
                      label: getLabelForAuthType(formikProps.values?.authType),
                      value: formikProps.values?.authType
                    }}
                    filterable={false}
                    onChange={val => {
                      formikProps.setFieldValue('authType', val.value)
                    }}
                    className={css.selectAuth}
                    inputProps={{ defaultValue: AuthTypes.USER_PASSWORD }}
                  >
                    <Button
                      text={getLabelForAuthType(formikProps?.values?.authType) || 'Select Authentication'}
                      rightIcon="chevron-down"
                      minimal
                    />
                  </SelectV2>
                </Layout.Horizontal>
                <ConnectorFormFields
                  formik={formikProps}
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  authType={(formikProps.values as any)?.authType}
                  name={connector?.name || ''}
                  onClickCreateSecret={() => openCreateSecretModal('SecretText')}
                  onEditSecret={() => openCreateSecretModal('SecretText', secretData?.data)}
                  isEditMode={true}
                />
              </div>
            ) : null}
          </div>

          <Layout.Horizontal margin={{ top: 'xxxlarge' }}>
            <Button intent="primary" type="submit" text={i18n.submit} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default KubCluster
