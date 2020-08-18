import React from 'react'
import type { FormikProps } from 'formik'
import { Connectors } from 'modules/dx/constants'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'

interface ConnectorFormProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: string
  connector: FormData
  formikProps: FormikProps<unknown>
  enableCreate?: boolean
  enableEdit?: boolean
}

const ConnectorForm: React.FC<ConnectorFormProps> = props => {
  const type = props?.type
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <KubCluster {...props} />
    case 'Vault': // TODO: use enum when backend fixes it
      return <span>To be implemented</span>
    default:
      return null
  }
}

export default ConnectorForm
