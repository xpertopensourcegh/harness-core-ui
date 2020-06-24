import xhr from '@wings-software/xhr-async'
// import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

interface CreateConnector {
  xhrGroup: string
  connector: any
}

export function createConnector({ xhrGroup, connector }: CreateConnector) {
  const url = `http://localhost:7457/connectors`
  return xhr.post(url, { xhrGroup, data: connector }).as('connector')
}

export function getConnector({ connectorId }: any) {
  const url = `http://localhost:7457/connectors/${connectorId}`

  return xhr.get(url).as('connectorDetails')
}
export function fetchAllConnectors() {
  const url = `http://localhost:7457/connectors`
  return xhr.get(url).as('connectorList')
}
