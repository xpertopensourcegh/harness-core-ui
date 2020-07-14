import React from 'react'
import { string } from 'yup'
import { FormInput, Layout, Icon, Button, Popover } from '@wings-software/uikit'
import { illegalIdentifiers, getIdentifierFromName } from 'framework/utils/StringUtils'
import * as Yup from 'yup'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import type { SecretManagerConfig } from 'services/cd-ng'
import css from './KubFormHelper.module.scss'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'

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
      .notOneOf(illegalIdentifiers),
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
const renderUserNameAndPassword = (secretManagers?: SecretManagerConfig[], connectorName?: string) => {
  const generatedId = getIdentifierFromName(connectorName || '')
  return (
    <>
      <FormInput.Text name="username" label="Username*" />
      <FormInput.Text name="password" label="Password*" />
      <Popover>
        <Button minimal rightIcon="chevron-down">
          <Icon name="key" />
        </Button>
        <SecretReference
          onSelect={secret => {
            // eslint-disable-next-line no-console
            console.log({ secret })
          }}
        />
      </Popover>
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
  secretManagers?: SecretManagerConfig[],
  connectorName?: string
) => {
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return renderUserNameAndPassword(secretManagers, connectorName)
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
    if (isSelected) {
      return (
        <Layout.Horizontal>
          <Icon name="harness" size={18} className={css.harnessSelectedIcon} /> <hr className={css.lineSelected} />{' '}
          <Icon name="white-cluster" size={32} className={css.clusterSelected} />
        </Layout.Horizontal>
      )
    } else {
      return (
        <Layout.Horizontal>
          <Icon name="harness" size={18} className={css.harnessIcon} /> <hr className={css.line} />{' '}
          <Icon name="blue-black-cluster" size={32} className={css.cluster} />
        </Layout.Horizontal>
      )
    }
  } else if (type === DelegateTypes.DELEGATE_OUT_CLUSTER) {
    // Todo: The code below will have one more Icon
    if (isSelected) {
      return (
        <Layout.Horizontal>
          <Icon name="harness" size={18} className={css.harnessSelectedIcon} /> <hr className={css.lineSelected} />{' '}
          <Icon name="white-full-cluster" size={32} className={css.clusterSelected} />
        </Layout.Horizontal>
      )
    } else {
      return (
        <Layout.Horizontal>
          <Icon name="harness" size={18} className={css.harnessIcon} /> <hr className={css.line} />{' '}
          <Icon name="grey-cluster" size={32} className={css.cluster} />
        </Layout.Horizontal>
      )
    }
  }
}
