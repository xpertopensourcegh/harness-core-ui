import xhr from '@wings-software/xhr-async'

export function getUsers({ accountId }: { accountId: string }): unknown {
  return xhr.get(`users?accountId=${accountId}`)
}
