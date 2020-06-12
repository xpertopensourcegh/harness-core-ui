import xhr from '@wings-software/xhr-async'

const prefix = 'https://localhost:9090/api/cv-nextgen/metric-pack/thresholds'

export async function saveMerics(payload: any, accId: any, queryParams: any) {
  const url = prefix + `?accountId=${accId}${queryParams}`
  return await xhr.post(url, { data: payload })
}

export async function getMerics(accId: any, queryParams: any) {
  const url = prefix + `?accountId=${accId}${queryParams}`
  return await xhr.get(url)
}
