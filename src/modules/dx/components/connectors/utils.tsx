import React from 'react'
import { Connectors } from 'modules/dx/constants'
import CreateGITConnector from 'modules/dx/components/connectors/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from 'modules/dx/components/connectors/CreateConnector/K8sConnector/CreateK8sConnector'
export const getConnectorWizardByType = (type: string, accountId: string, hideLightModal: () => void) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <CreateK8sConnector accountId={accountId} hideLightModal={hideLightModal} />
    case Connectors.GIT:
      return <CreateGITConnector />
    default:
      return null
  }
}
