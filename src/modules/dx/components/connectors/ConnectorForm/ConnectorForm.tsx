import React from 'react'
import { Connectors } from 'modules/dx/constants'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import GITConnectorForm from 'modules/dx/pages/connectors/Forms/GITConnector/GITConnectorForm'
import DockerConnectorForm from 'modules/dx/pages/connectors/Forms/Docker/DockerConnectorForm'
import type { ConnectorDTO, ConnectorRequestWrapper } from 'services/cd-ng'

interface ConnectorFormProps {
  type: string
  connector: ConnectorDTO
  setConnector: (val: ConnectorDTO) => void
  enableCreate?: boolean
  enableEdit?: boolean
  onSubmit: (data: ConnectorRequestWrapper) => void
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
    case 'Vault': // TODO: use enum when backend fixes it
      return <span>To be implemented</span>

    default:
      return null
  }
}

export default ConnectorForm
