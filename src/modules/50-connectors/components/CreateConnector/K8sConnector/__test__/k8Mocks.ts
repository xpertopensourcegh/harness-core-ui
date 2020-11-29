import type { ResponseBoolean } from 'services/cd-ng'

export const usernamePassword = {
  name: 'k87',
  identifier: 'k8',
  description: 'k8 descriptipn',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: ['k8'],
  type: 'K8sCluster',
  spec: {
    credential: {
      type: 'ManualConfig',
      spec: {
        masterUrl: '/url7878',
        auth: { type: 'UsernamePassword', spec: { username: 'dev', passwordRef: 'account.k8serviceToken' } }
      }
    }
  }
}

export const serviceAccount = {
  name: 'k8Connector',
  identifier: 'k8',
  description: 'k8 descriptipn',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: ['k8'],
  type: 'K8sCluster',
  spec: {
    credential: {
      type: 'ManualConfig',
      spec: {
        masterUrl: '/url',
        auth: { type: 'ServiceAccount', spec: { serviceAccountTokenRef: 'account.k8serviceToken' } }
      }
    }
  }
}

export const oidcMock = {
  name: 'k8Connector',
  identifier: 'k8',
  description: 'k8 descriptipn',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: ['k8'],
  type: 'K8sCluster',
  spec: {
    credential: {
      type: 'ManualConfig',
      spec: {
        masterUrl: '/url',
        auth: {
          type: 'OpenIdConnect',
          spec: {
            oidcIssuerUrl: null,
            oidcUsername: 'OIDC username ',
            oidcClientIdRef: 'account.clientKey',
            oidcPasswordRef: 'account.clientPassphrase',
            oidcSecretRef: 'account.k8certificate',
            oidcScopes: 'account'
          }
        }
      }
    }
  }
}

export const clientKeyMock = {
  name: 'k8Connector',
  identifier: 'k8',
  description: 'k8 descriptipn',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: ['k8'],
  type: 'K8sCluster',
  spec: {
    credential: {
      type: 'ManualConfig',
      spec: {
        masterUrl: '/url',
        auth: {
          type: 'ClientKeyCert',
          spec: {
            caCertRef: 'account.b12',
            clientCertRef: 'account.b13',
            clientKeyRef: 'account.k8serviceToken',
            clientKeyPassphraseRef: 'account.k8serviceToken',
            clientKeyAlgo: null
          }
        }
      }
    }
  }
}

export const mockSecret = {
  status: 'SUCCESS',
  data: {
    secret: {
      type: 'SecretText',
      name: 'k8serviceToken',
      identifier: 'k8serviceToken',
      tags: {},
      description: '',
      spec: { secretManagerIdentifier: 'harnessSecretManager', valueType: 'Inline', value: null }
    },
    createdAt: 1606279738238,
    updatedAt: 1606279738238,
    draft: false
  },
  metaData: null,
  correlationId: 'testCorrelationId'
}

export const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}
