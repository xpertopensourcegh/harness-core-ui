import React from 'react'
import { Connectors } from '../../constants'
import { getKubValidationSchema } from './Forms/KubeFormHelper'
import KubCluster from './Forms/KubCluster'

export const getValidationSchemaByType = (type: string) => {
  if (!type) return null
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return getKubValidationSchema()

    default:
      return null
  }
}

export const getFormByType = (type: string) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <KubCluster />

    default:
      return null
  }
}
