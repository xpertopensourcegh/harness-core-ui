export interface LogResponse {
  args?: any
  level: string
  out: string
  pos: number
  time: string
}

/**
 * Get Logs from blob
 */

// TODO migrate to useGet restfull react, after demo
export async function getLogsFromBlob(
  accountIdentifier: string,
  orgIdentifier: string,
  projectIdentifier: string,
  buildIdentifier: string,
  stageIdentifier: string,
  stepIdentifier: string,
  setLogs: Function
): Promise<void> {
  try {
    fetch(
      `https://qb.harness.io/log-service/api/accounts/${accountIdentifier}/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/logs/${stageIdentifier}/${stepIdentifier}/blob`
    )
      .then(resp => resp.text())
      .then(resp => {
        const lines = resp.split('\n')
        const data = lines.filter(line => line.length > 0).map(line => line && JSON.parse(line))
        const parsedData = data.map((item: LogResponse) => {
          return {
            logLevel: item?.level.toUpperCase(),
            createdAt: item.time,
            logLine: item?.out
          }
        })
        setLogs(parsedData)
      })
  } catch (e) {
    // console.log(e);
  }
}
