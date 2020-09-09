import React from 'react'
import { string } from 'yup'
import { Layout, Icon } from '@wings-software/uikit'
import * as Yup from 'yup'
import cx from 'classnames'
import { StringUtils } from 'modules/common/exports'
import { AuthTypes, DelegateTypes } from './KubeFormInterfaces'
import css from './KubFormHelper.module.scss'

export interface AuthOption {
  label: string
  value: string
}

export const authOptions: AuthOption[] = [
  { value: AuthTypes.USER_PASSWORD, label: 'Username and password' },
  { value: AuthTypes.SERVICE_ACCOUNT, label: 'Service Account Token' },
  { value: AuthTypes.OIDC, label: 'OIDC Token' },
  { value: AuthTypes.CLIENT_KEY_CERT, label: 'Client Key Certificate' }
]

export interface SecretFieldByType {
  passwordField: string
  secretField: string
}

export const DelegateInClusterType = {
  useExistingDelegate: 'useExistingDelegate',
  addNewDelegate: 'addnewDelegate'
}

export const AuthTypeFields = {
  username: 'username',
  passwordRef: 'passwordRef',
  serviceAccountTokenRef: 'serviceAccountTokenRef',
  oidcIssuerUrl: 'oidcIssuerUrl',
  oidcUsername: 'oidcUsername',
  oidcClientIdRef: 'oidcClientIdRef',
  oidcPasswordRef: 'oidcPasswordRef',
  oidcSecretRef: 'oidcSecretRef',
  oidcScopes: 'oidcScopes',
  clientCertRef: 'clientCertRef',
  clientKeyRef: 'clientKeyRef',
  clientKeyPassphraseRef: 'clientKeyPassphraseRef',
  clientKeyAlgo: 'clientKeyAlgo',
  caCertRef: 'caCertRef'
}

export const getSecretFieldsByType = (type: string) => {
  switch (type) {
    case AuthTypes.USER_PASSWORD:
      return [{ passwordField: 'passwordRef', secretField: 'passwordRefSecret' }]
    case AuthTypes.SERVICE_ACCOUNT:
      return [{ passwordField: 'serviceAccountTokenRef', secretField: 'serviceAccountTokenRefSecret' }]
    case AuthTypes.OIDC:
      return [
        { passwordField: 'oidcPasswordRef', secretField: 'oidcPasswordRefSceret' },
        { passwordField: 'oidcSecretRef', secretField: 'oidcSecretRefSecret' },
        { passwordField: 'oidcClientIdRef', secretField: 'oidcClientIdRefSecret' }
      ]
    case AuthTypes.CLIENT_KEY_CERT:
      return [
        { passwordField: 'clientKeyRef', secretField: 'clientKeyRefSecret' },
        { passwordField: 'clientCertRef', secretField: 'clientCertRefSecret' },
        { passwordField: 'clientKeyPassphraseRef', secretField: 'clientKeyPassphraseRefSecret' }
      ]
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
