import xhr from '@wings-software/xhr-async'

export async function fetchQueriesFromSplunk({ accountId, dataSourceId = '', xhrGroup }: any) {
  const url = `https://localhost:9090/api/cv-nextgen/splunk/saved-searches?accountId=${accountId}&connectorId=${dataSourceId}`
  return await xhr.get(url, { group: xhrGroup })
}
