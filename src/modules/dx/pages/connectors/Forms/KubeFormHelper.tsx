import React from 'react'
import { string } from 'yup'
import { StringUtils } from 'modules/common/exports'
import { FormInput, Layout, Icon, Popover } from '@wings-software/uikit'
import * as Yup from 'yup'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import type { SecretManagerConfigDTO } from 'services/cd-ng'
import css from './KubFormHelper.module.scss'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import type { FormikProps } from 'formik'
import cx from 'classnames'

export const AuthTypes = {
  CUSTOM: 'ManualConfig',
  USER_PASSWORD: 'UsernamePassword',
  SERVICE_ACCOUNT: 'ServiceAccount',
  OIDC: 'OpenIdConnect'
}
export interface AuthOption {
  label: string
  value: string
}

export const authOptions: AuthOption[] = [
  { value: AuthTypes.USER_PASSWORD, label: 'Username and password' },
  { value: AuthTypes.SERVICE_ACCOUNT, label: 'Service Account Token' },
  { value: AuthTypes.OIDC, label: 'OIDC Token' },
  { value: AuthTypes.CUSTOM, label: 'Custom' }
]

export const DelegateTypes = {
  DELEGATE_IN_CLUSTER: 'InheritFromDelegate',
  DELEGATE_OUT_CLUSTER: 'ManualConfig'
}

export const DelegateInClusterType = {
  useExistingDelegate: 'useExistingDelegate',
  addNewDelegate: 'addnewDelegate'
}

export const authTypeFields = {
  username: 'username',
  password: 'password',
  serviceAccountToken: 'serviceAccountToken',
  oidcIdentityProviderUrl: 'oidcIdentityProviderUrl',
  oidcUsername: 'oidcUsername',
  oidcPassword: 'oidcPassword',
  oidcClientId: 'oidcClientId',
  oidcSecret: 'oidcSecret',
  oidcScopes: 'oidcScopes',
  clientKeyAlgorithm: 'clientKeyAlgorithm',
  clientKeyPassPhrase: 'clientKeyPassPhrase',
  clientKey: 'clientKey',
  clientCert: 'clientCert',
  caCert: 'caCert'
}

export const getFieldsByAuthType = (authType: string) => {
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return ['username', 'password']
    case AuthTypes.SERVICE_ACCOUNT:
      return ['serviceAccountToken']
    case AuthTypes.OIDC:
      return ['oidcIdentityProviderUrl', 'oidcUsername', 'oidcPassword', 'oidcClientId', 'oidcSecret', 'oidcScopes']
    case AuthTypes.CUSTOM:
      return [
        'username',
        'password',
        'caCert',
        'clientCert',
        'clientKey',
        'clientKeyPassPhrase',
        'clientKeyAlgorithm',
        'serviceAccountToken'
      ]
    default:
      return []
  }
}

const isUserPasswordAuthType = (useKubernetesDelegate: boolean, authType: string) => {
  return !useKubernetesDelegate && authType === AuthTypes.USER_PASSWORD
}

const isServiceAccountType = (useKubernetesDelegate: boolean, authType: string) => {
  return !useKubernetesDelegate && authType === AuthTypes.SERVICE_ACCOUNT
}

const isOIDCType = (useKubernetesDelegate: boolean, authType: string) => {
  return !useKubernetesDelegate && authType === AuthTypes.OIDC
}

export const getKubValidationSchema = () => {
  return Yup.object().shape({
    name: Yup.string().trim().max(1000, 'Name is Too Long!').required('Name is required.'),
    description: Yup.string().trim(),
    identifier: Yup.string()
      .trim()
      .required()
      .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
      .notOneOf(StringUtils.illegalIdentifiers),
    delegateName: Yup.string().when('useKubernetesDelegate', {
      is: true,
      then: string().trim().required('Delegate is required.')
    }),
    masterUrl: string().when('useKubernetesDelegate', {
      is: true,
      then: string().trim().required('Master URL is required.')
    }),
    authType: string().when('useKubernetesDelegate', {
      is: false,
      then: string().trim().required('Authentication type is required.')
    }),
    username: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isUserPasswordAuthType(useKubernetesDelegate, authType),
      then: string().trim().required('Username is required.')
    }),
    password: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isUserPasswordAuthType(useKubernetesDelegate, authType),
      then: string().trim().required('Password is required.')
    }),
    serviceAccountToken: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isServiceAccountType(useKubernetesDelegate, authType),
      then: string().trim().required('Service Account Token is required.')
    }),
    oidcIdentityProviderUrl: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isOIDCType(useKubernetesDelegate, authType),
      then: string().trim().required('URL is required.')
    }),
    oidcUsername: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isOIDCType(useKubernetesDelegate, authType),
      then: string().trim().required('Username is required.')
    }),
    oidcPassword: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isOIDCType(useKubernetesDelegate, authType),
      then: string().trim().required('Password is required.')
    }),
    oidcClientId: string().when(['useKubernetesDelegate', 'authType'], {
      is: (useKubernetesDelegate, authType) => isOIDCType(useKubernetesDelegate, authType),
      then: string().trim().required('Client ID is required.')
    })
  })
}

const getSelectSecretPopover = (formikProps?: FormikProps<any>) => {
  return (
    <Popover>
      <div className={css.secretPop}>
        <Icon name="key" size={24} /> <Icon name="chevron-down" size={14} />
      </div>
      <SecretReference
        onSelect={secret => {
          formikProps?.setFieldValue('password', secret?.name)
        }}
      />
    </Popover>
  )
}
const renderUserNameAndPassword = (
  secretManagers?: SecretManagerConfigDTO[],
  connectorName?: string,
  formikProps?: FormikProps<any>
) => {
  const generatedId = StringUtils.getIdentifierFromName(connectorName || '')
  return (
    <>
      <FormInput.Text name="username" label="Username*" />
      <FormInput.Text
        name="password"
        label={
          <div className={css.labelWrp}>
            <div className={css.passwordLabel}>Password</div>
            {getSelectSecretPopover(formikProps)}
          </div>
        }
        inputGroup={{ type: 'password' }}
      />
      <FormikCreateInlineSecret
        name="passwordSecret"
        secretManagers={secretManagers}
        defaultSecretName={generatedId}
        defaultSecretId={generatedId}
      />
    </>
  )
}

const customFieldsForServiceAccountToken = () => {
  return (
    <FormInput.Select
      name="password"
      label="Select Encrypted Client Key Passphrase*"
      items={[
        { label: 'password_one', value: 'password_one' },
        { label: 'password_two', value: 'password_two' }
      ]}
    />
  )
}

const fieldsForOIDCToken = () => {
  return (
    <>
      <FormInput.Text name="identityProviderUrl" label="Identity Provider Url*" />
      {renderUserNameAndPassword()}
      <FormInput.Select
        name="password"
        label="Select Encrypted Client Id*"
        items={[
          { label: 'password_one', value: 'password_one' },
          { label: 'password_two', value: 'password_two' }
        ]}
      />
      <FormInput.Select
        name="password"
        label="Select Encrypted Client Secret*"
        items={[
          { label: 'password_one', value: 'password_one' },
          { label: 'password_two', value: 'password_two' }
        ]}
      />
      <FormInput.Text name="identityProviderUrl" label="OIDC Scopes" />
    </>
  )
}

export const getCustomFields = (
  authType: string | number | symbol,
  secretManagers?: SecretManagerConfigDTO[],
  connectorName?: string,
  formikProps?: FormikProps<any>
) => {
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return renderUserNameAndPassword(secretManagers, connectorName, formikProps)
    case AuthTypes.SERVICE_ACCOUNT:
      return customFieldsForServiceAccountToken()
    case AuthTypes.OIDC:
      return fieldsForOIDCToken()
    case AuthTypes.CUSTOM:
      return (
        <>
          <FormInput.Text name="username" label="Username" />
          <FormInput.Select
            name="password"
            label="Select Encrypted Password*"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
          <FormInput.Select
            name="caCert"
            label="Select Encrypted CA Certificate*"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
          <FormInput.Select
            name="clientCert"
            label="Select Encrypted Client Certificate*"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
          <FormInput.Select
            name="clientKey"
            label="Select Encrypted Client Key*"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
          <FormInput.Select
            name="clientKeyPassPhrase"
            label="Select Encrypted Client Key Passphrase"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
          <FormInput.Text name="clientKeyAlgorithm" label="Client Key Algorithm" />

          <FormInput.Select
            name="serviceAccountToken"
            label="Select Encrypted Service Account Token"
            items={[
              { label: 'password_one', value: 'password_one' },
              { label: 'password_two', value: 'password_two' }
            ]}
          />
        </>
      )
    default:
      return <></>
  }
}

export const getIconsForCard = (type: string, isSelected: boolean) => {
  if (type === DelegateTypes.DELEGATE_IN_CLUSTER) {
    return (
      <Layout.Horizontal>
        <Icon name="harness" size={18} className={isSelected ? css.harnessSelectedIcon : css.harnessIcon} />{' '}
        <hr className={cx(css.lineWidthFull, { [css.lineSelected]: isSelected, [css.line]: !isSelected })} />
        <Icon
          name={isSelected ? 'white-cluster' : 'blue-black-cluster'}
          size={32}
          className={isSelected ? css.clusterSelected : css.cluster}
        />
      </Layout.Horizontal>
    )
  } else if (type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
    return (
      <Layout.Horizontal>
        <Icon name="harness" size={18} className={isSelected ? css.harnessSelectedIcon : css.harnessIcon} />
        <hr className={cx(css.lineWidthHalf, { [css.lineSelected]: isSelected, [css.line]: !isSelected })} />
        <Icon
          name="polygon"
          size={12}
          padding={{ left: 'large' }}
          className={cx(css.polygon, { [css.selectedPolygon]: isSelected })}
        />
        <hr className={cx(css.lineWidthHalf, { [css.lineSelected]: isSelected, [css.line]: !isSelected })} />
        <Icon
          name={isSelected ? 'white-full-cluster' : 'grey-cluster'}
          size={32}
          // className
          padding={{ left: 'large' }}
          className={isSelected ? css.clusterSelected : css.cluster}
        />
      </Layout.Horizontal>
    )
  }
}
