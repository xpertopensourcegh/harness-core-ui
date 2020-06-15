import { object, string } from 'yup'
export const AuthTypes = {
  CUSTOM: 'NONE',
  USER_PASSWORD: 'USER_PASSWORD',
  SERVICE_ACCOUNT: 'SERVICE_ACCOUNT',
  OIDC: 'OIDC'
}

export const authOptions = [
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
    })
  })
}
