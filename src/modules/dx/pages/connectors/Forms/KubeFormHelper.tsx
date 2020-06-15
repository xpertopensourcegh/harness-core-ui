import React from 'react'
import { object, string } from 'yup'
import { FormInput } from '@wings-software/uikit'
export const AuthTypes = {
  CUSTOM: 'NONE',
  USER_PASSWORD: 'USER_PASSWORD',
  SERVICE_ACCOUNT: 'SERVICE_ACCOUNT',
  OIDC: 'OIDC'
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

export const getKubValidationSchema = () => {
  return object().shape({
    name: string().trim().max(1000, 'Name is Too Long!').required('Name is required.'),
    description: string().trim(),
    identifier: string().trim(),
    delegateName: string().when('useKubernetesDelegate', {
      is: true,
      then: string().trim().required('Delegate is required.')
    }),
    masterUrl: string().when('useKubernetesDelegate', {
      is: false,
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
    })
  })
}
const renderUserNameAndPassword = () => {
  return (
    <>
      <FormInput.Text name="username" label="Username*" />
      <FormInput.Select
        name="password"
        label="Select Encrypted Password*"
        items={[
          { label: 'password_one', value: 'password_one' },
          { label: 'password_two', value: 'password_two' }
        ]}
      />
    </>
  )
}

export const getCustomFields = (authType: string | number | symbol) => {
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return renderUserNameAndPassword()
    default:
      return <div></div>
  }
}
