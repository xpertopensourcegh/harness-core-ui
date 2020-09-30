import React from 'react'
import { Connectors } from 'modules/dx/constants'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import GITConnectorForm from 'modules/dx/pages/connectors/Forms/GITConnector/GITConnectorForm'
import DockerConnectorForm from 'modules/dx/pages/connectors/Forms/Docker/DockerConnectorForm'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import EditVaultConfigForm from '../CreateConnector/SecretManager/views/EditVaultConfigForm'

export interface ConnectorFormProps {
  type: string
  connector: ConnectorInfoDTO
  setConnector: (val: ConnectorInfoDTO) => void
  setConnectorForYaml: (val: ConnectorInfoDTO) => void
  enableCreate?: boolean
  enableEdit?: boolean
  onSubmit: (data: ConnectorRequestBody) => void
}

const ConnectorForm: React.FC<ConnectorFormProps> = props => {
  const type = props?.type
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <KubCluster {...props} />
    case Connectors.GIT:
      return <GITConnectorForm {...props} />
    case Connectors.DOCKER:
      return <DockerConnectorForm {...props} />
    case Connectors.VAULT:
      return <EditVaultConfigForm {...props} />

    default:
      return null
  }
}

export default ConnectorForm
