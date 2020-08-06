import React from 'react'
import { string } from 'yup'
import { FormInput, Layout, Icon, Popover } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { Position } from '@blueprintjs/core'
import cx from 'classnames'
import { StringUtils } from 'modules/common/exports'
import { FormikCreateInlineSecret } from 'modules/common/components/CreateInlineSecret/CreateInlineSecret'
import SecretReference from 'modules/dx/components/SecretReference/SecretReference'
import { accountId } from 'modules/cv/constants'
import css from './KubFormHelper.module.scss'

export const AuthTypes = {
  CLIENT_KEY_CERT: 'ClientKeyCert',
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
  { value: AuthTypes.CLIENT_KEY_CERT, label: 'Client Key Certificate' }
]
export interface SceretFieldByType {
  passwordField: string
  secretField: string
}

export const DelegateTypes = {
  DELEGATE_IN_CLUSTER: 'InheritFromDelegate',
  DELEGATE_OUT_CLUSTER: 'ManualConfig'
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

export const getSecretFieldValue = (field: string) => {
  switch (field) {
    case AuthTypeFields.passwordRef:
      return 'passwordRefSecret'
    case AuthTypeFields.serviceAccountTokenRef:
      return 'serviceAccountTokenRefSecret'
    case AuthTypeFields.oidcClientIdRef:
      return 'oidcClientIdRefSecret'
    case AuthTypeFields.oidcPasswordRef:
      return 'oidcPasswordRefSceret'
    case AuthTypeFields.oidcSecretRef:
      return 'oidcSecretRefSecret'
    case AuthTypeFields.clientKeyRef:
      return 'clientKeyRefSecret'
    case AuthTypeFields.clientKeyPassphraseRef:
      return 'clientKeyPassphraseRefSecret'
    case AuthTypeFields.clientCertRef:
      return 'clientCertRefSecret'
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

const getSelectSecretPopover = (formikProps?: FormikProps<any>): React.ReactElement => {
  return (
    <Popover position={Position.BOTTOM}>
      <div className={css.secretPop}>
        <Icon name="key-main" size={24} height={12} width={24} /> <Icon name="chevron-down" size={14} />
      </div>
      <SecretReference
        accountIdentifier={accountId} // TODO: remove sample account id when integrating
        onSelect={secret => {
          formikProps?.setFieldValue('password', secret?.name)
        }}
      />
    </Popover>
  )
}
const getLabelForEncryptedSecret = (field: string) => {
  switch (field) {
    case AuthTypeFields.passwordRef:
      return 'Password'
    case AuthTypeFields.serviceAccountTokenRef:
      return 'Service Account Token'
    case AuthTypeFields.oidcPasswordRef:
      return 'Password'
    case AuthTypeFields.oidcClientIdRef:
      return 'Client ID'
    case AuthTypeFields.oidcSecretRef:
      return 'Client Secret'
    case AuthTypeFields.clientKeyRef:
      return 'Client Key'
    case AuthTypeFields.clientKeyPassphraseRef:
      return 'Client Key Passphrase'
    case AuthTypeFields.clientCertRef:
      return 'Client Certificate'
  }
}

export const getSecretComponent = (passwordField: string, connectorName?: string, formikProps?: FormikProps<any>) => {
  const generatedId = StringUtils.getIdentifierFromName(connectorName || '').concat(passwordField)
  return (
    <>
      <FormInput.Text
        name={passwordField}
        label={
          <div className={css.labelWrp}>
            <div className={css.passwordLabel}>{getLabelForEncryptedSecret(passwordField)}</div>
            {getSelectSecretPopover(formikProps)}
          </div>
        }
        inputGroup={{ type: 'password' }}
      />
      <FormikCreateInlineSecret
        name={getSecretFieldValue(passwordField) as string}
        defaultSecretName={generatedId}
        defaultSecretId={generatedId}
        accountIdentifier={accountId} // TODO: remove sample account id when integrating
      />
    </>
  )
}
const renderUserNameAndPassword = (connectorName?: string, formikProps?: FormikProps<any>) => {
  return (
    <>
      <FormInput.Text name="username" label="Username" />
      {getSecretComponent(AuthTypeFields.passwordRef, connectorName, formikProps)}
    </>
  )
}

const fieldsForOIDCToken = (connectorName?: string, formikProps?: FormikProps<any>) => {
  return (
    <>
      <FormInput.Text name={AuthTypeFields.oidcIssuerUrl} label="Identity Provider Url" />
      <FormInput.Text name={AuthTypeFields.oidcUsername} label="Username" />
      {getSecretComponent(AuthTypeFields.oidcPasswordRef, connectorName, formikProps)}
      {getSecretComponent(AuthTypeFields.oidcClientIdRef, connectorName, formikProps)}
      {getSecretComponent(AuthTypeFields.oidcSecretRef, connectorName, formikProps)}
      <FormInput.Text name={AuthTypeFields.oidcScopes} label="OIDC Scopes" />
    </>
  )
}

export const renderFieldsForClientKeyCert = (connectorName?: string, formikProps?: FormikProps<any>) => {
  return (
    <>
      {getSecretComponent(AuthTypeFields.clientKeyRef, connectorName, formikProps)}
      {getSecretComponent(AuthTypeFields.oidcClientIdRef, connectorName, formikProps)}
      {getSecretComponent(AuthTypeFields.clientKeyPassphraseRef, connectorName, formikProps)}
      <FormInput.Text name={AuthTypeFields.clientKeyAlgo} label={getSecretFieldValue(AuthTypeFields.clientCertRef)} />
    </>
  )
}

export const getCustomFields = (
  authType: string | number | symbol,
  connectorName?: string,
  formikProps?: FormikProps<any>
): React.ReactElement => {
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return renderUserNameAndPassword(connectorName, formikProps)
    case AuthTypes.SERVICE_ACCOUNT:
      return getSecretComponent(AuthTypeFields.serviceAccountTokenRef, connectorName, formikProps)
    case AuthTypes.OIDC:
      return fieldsForOIDCToken(connectorName, formikProps)
    case AuthTypes.CLIENT_KEY_CERT:
      return renderFieldsForClientKeyCert(connectorName, formikProps)
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
