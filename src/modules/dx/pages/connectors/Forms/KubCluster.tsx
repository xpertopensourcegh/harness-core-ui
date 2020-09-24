import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { omit } from 'lodash-es'
import cx from 'classnames'
import * as Yup from 'yup'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  SelectV2,
  Button,
  SelectOption,
  Text
} from '@wings-software/uikit'
import { CardSelect, Icon } from '@wings-software/uikit'
import ConnectorFormFields from 'modules/dx/components/connectors/ConnectorFormFields/ConnectorFormFields'
import { useGetKubernetesDelegateNames } from 'services/portal'
import type { ConnectorDTO, ConnectorRequestWrapper } from 'services/cd-ng'
import type { InlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import {
  getSecretV2Promise,
  SecretTextSpecDTO,
  KubernetesOpenIdConnectDTO,
  KubernetesClientKeyCertDTO,
  KubernetesServiceAccountDTO,
  KubernetesUserNamePasswordDTO,
  ResponseDTOSecretResponseWrapper
} from 'services/cd-ng'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import useCreateUpdateSecretModal from 'modules/dx/modals/CreateSecretModal/useCreateUpdateSecretModal'
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
  connector: ConnectorDTO
  setConnector: (data: ConnectorDTO) => void
  enableCreate?: boolean
  onSubmit: (data: ConnectorRequestWrapper) => void
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
  const [selectedDelegate, setSelectedDelegate] = useState({ type: '', value: '', icon: '' })
  const [authentication, setAuthentication] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { loading, data: delegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId }
  })
  const { openCreateSecretModal } = useCreateUpdateSecretModal({})
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const { connector } = props

  const radioProps = {
    data: delegateData,
    className: css.delegateSetup,
    renderItem: function renderItem(item: any) {
      return (
        <div className={cx(css.cardCss, { [css.selectedCard]: item.type === selectedDelegate?.type })}>
          <div className={css.cardContent}>
            {item.value}
            {getIconsForCard(item.type, item.type === selectedDelegate?.type)}
          </div>
          {item.type === selectedDelegate?.type ? (
            <Icon name="deployment-success-new" size={16} className={css.tickWrp} />
          ) : null}
        </div>
      )
    }
  }
  const [secretData, setSecretData] = useState<ResponseDTOSecretResponseWrapper>()

  const [passwordRefSecret, setPasswordRefSecret] = useState<InlineSecret>()
  const [serviceAccountTokenRefSecret, setServiceAccountTokenRefSecret] = useState<InlineSecret>()
  const [oidcPasswordRefSecret, setOidcPasswordRefSecret] = useState<InlineSecret>()
  const [oidcClientIdRefSecret, setOidcClientIdRefSecret] = useState<InlineSecret>()
  const [oidcSecretRefSecret, setOidcSecretRefSecret] = useState<InlineSecret>()
  const [clientCertRefSecret, setClientCertRefSecret] = useState<InlineSecret>()
  const [clientKeyRefSecret, setClientKeyRefSecret] = useState<InlineSecret>()
  const [clientKeyPassphraseRefSecret, setCientKeyPassphraseRefSecret] = useState<InlineSecret>()
  const [caCertRefSecret, setCaCertRefSecret] = useState<InlineSecret>()

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
  const getSecrets = (
    formData:
      | KubernetesClientKeyCertDTO
      | KubernetesOpenIdConnectDTO
      | KubernetesServiceAccountDTO
      | KubernetesUserNamePasswordDTO
  ) => {
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
  useEffect(() => {
    if (connector && connector.spec?.type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
      const formData = buildKubFormData(connector)
      getSecrets(formData)
    }
  }, [])

  useEffect(() => {
    if (connector) {
      if (connector?.spec?.type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
        setAuthentication({
          label: getLabelForAuthType(connector?.spec?.spec?.auth?.type),
          value: connector?.spec?.spec?.auth?.type
        })
      } else if (connector?.spec?.type === DelegateTypes.DELEGATE_IN_CLUSTER) {
        setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
      }
      if (connector?.spec?.type) {
        const val = { type: connector?.spec?.type, value: '', icon: '' }
        setSelectedDelegate(val)
      }
    }
  }, [props])
  const delegateListFiltered = formatDelegateList(delegateList?.resource) || [{ label: '', value: '' }]
  const kubFormData = omit(buildKubFormData(connector), [
    'passwordRef',
    'serviceAccountTokenRef',
    'oidcPasswordRef',
    'oidcClientIdRef',
    'oidcSecretRef',
    'clientCertRef',
    'clientKeyRef',
    'clientKeyPassphraseRef',
    'caCertRef'
  ])

  return (
    <Formik
      initialValues={{
        ...kubFormData,
        passwordRefSecret,
        serviceAccountTokenRefSecret,
        oidcPasswordRefSecret,
        oidcClientIdRefSecret,
        oidcSecretRefSecret,
        clientCertRefSecret,
        clientKeyRefSecret,
        clientKeyPassphraseRefSecret,
        caCertRefSecret
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(),
        description: Yup.string(),
        delegateType: Yup.string().trim().required(),
        delegateName: Yup.string().trim()
      })}
      enableReinitialize={true}
      onSubmit={formData => {
        props.onSubmit(buildKubPayload(formData))
      }}
      validate={data => props.setConnector(buildKubPayload(data).connector)}
    >
      {formikProps => (
        <Form>
          <div className={css.formCustomCss}>
            <FormInput.InputWithIdentifier isIdentifierEditable={false} />
            <FormInput.TextArea label={i18n.description} name="description" />
            <FormInput.TagInput
              name="tags"
              label={i18n.tags}
              items={connector?.tags || []}
              labelFor={name => (typeof name === 'string' ? name : '')}
              itemFromNewTag={newTag => newTag}
              className={css.tags}
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
              {...radioProps}
              onChange={(item: SelectedDelegate) => {
                setSelectedDelegate(item)
                formikProps.setFieldValue('delegateType', item.type)
              }}
              selected={selectedDelegate}
            />
            {selectedDelegate?.type === DelegateTypes.DELEGATE_IN_CLUSTER && !loading ? (
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
            {selectedDelegate?.type === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
              <div className={css.delgateOutCluster}>
                <FormInput.Text label={i18n.masterUrl} name="masterUrl" />
                <Layout.Horizontal className={css.credWrapper}>
                  <div className={css.label}>
                    <Icon name="lock" size={14} className={css.lockIcon} />
                    {i18n.credentials}
                  </div>
                  <SelectV2
                    items={authOptions}
                    value={authentication}
                    filterable={false}
                    onChange={val => {
                      setAuthentication(val)
                      formikProps.setFieldValue('authType', val.value)
                    }}
                    className={css.selectAuth}
                  >
                    <Button text={authentication?.label} rightIcon="chevron-down" minimal />
                  </SelectV2>
                </Layout.Horizontal>
                <ConnectorFormFields
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  authType={authentication.value}
                  name={connector?.name || ''}
                  onClickCreateSecret={() => openCreateSecretModal('SecretText')}
                  onEditSecret={() => openCreateSecretModal('SecretText', secretData?.data)}
                  isEditMode={true}
                />
              </div>
            ) : null}
          </div>

          <Layout.Horizontal>
            <Button intent="primary" type="submit" text={i18n.submit} />
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default KubCluster
