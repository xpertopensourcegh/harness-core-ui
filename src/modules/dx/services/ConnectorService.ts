import xhr from '@wings-software/xhr-async'
// import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

interface CreateConnector {
  xhrGroup: string
  connector: any
  accountId: any
}

export function createConnector({ xhrGroup, connector, accountId }: CreateConnector) {
  const url = `https://localhost:9090/api/ng/connectors?accountId=${accountId}`
  return xhr.post(url, { xhrGroup, data: connector }).as('connector')
}

export function updateConnector({ xhrGroup, connector, accountId }: CreateConnector) {
  const url = `https://localhost:9090/api/ng/connectors?accountId=${accountId}`
  return xhr.put(url, { xhrGroup, data: connector }).as('connector')
}
export function getConnector({ connectorId, accountId }: any) {
  const url = `https://localhost:9090/api/ng/connectors/${connectorId}?accountId=${accountId}`
  // const url = `http://localhost:7457/connectors/${connectorId}`

  return xhr.get(url).as('connectorDetails')
}
export function fetchAllConnectors({ accountId }: any) {
  const url = `https://localhost:9090/api/ng/connectors?accountId=${accountId}`
  return xhr.get(url).as('connectorList')
}

export function fetchExistingDelegates({ accountId }: any) {
  const url = `https://localhost:9090/api/setup/delegates/kubernetes-delegates?accountId=${accountId}`
  return xhr.get(url).as('delegateList')
}
export function deleteConnector({ connectorId, accountId }: any) {
  const url = `https://localhost:9090/api/ng/connectors/${connectorId}?accountId=${accountId}`
  return xhr.delete(url)
}
export function checkDelegates({ accountId }: any) {
  const url = `https://localhost:9090/api/setup/delegates/status?accountId=${accountId}`
  return xhr.get(url).as('delegateStatus')
}
export function validateCredentials({ data, accountId }: any) {
  const url = `https://localhost:9090/api/ng/connectors/validate?accountId=${accountId}`
  return xhr.post(url, { data: data }).as('validateStatus')
}
