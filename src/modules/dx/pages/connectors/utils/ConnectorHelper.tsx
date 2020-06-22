import React from 'react'
import { Connectors } from 'modules/dx/constants'
import { getKubValidationSchema } from '../Forms/KubeFormHelper'
import KubCluster from '../Forms/KubCluster'
import type { ConfigureConnectorProps } from '../ConfigureConnector'

export const getValidationSchemaByType = (type: string) => {
  if (!type) return null
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getKubValidationSchema()

    default:
      return null
  }
}

export const getFormByType = (props: ConfigureConnectorProps, formikProps: any): JSX.Element | null => {
  const { connector } = props
  const type = connector?.type
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <KubCluster {...props} formikProps={formikProps} />

    default:
      return null
  }
}
export const getKubInitialValues = () => {
  return {
    type: 'KUBERNETES_CLUSTER',
    name: 'NAME',
    description: '',
    identifier: '',
    tags: [],
    delegateMode: '',
    credentialType: '',
    credential: {
      masterUrl: '',
      manualCredentialType: '',
      manualCredentials: {
        userName: '',
        encryptedPassword: ''
      }
    }
  }
}
