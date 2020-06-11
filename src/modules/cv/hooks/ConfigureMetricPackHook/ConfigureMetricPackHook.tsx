import { useEffect, useMemo, useState, useCallback } from 'react'
import xhr from '@wings-software/xhr-async'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import type { MetricPack } from '@wings-software/swagger-ts/definitions'

function transformConfigMetricPackToMap(metricPacks: MetricPack[], metricPackMapApi: Map<string, MetricPack>): void {
  metricPacks?.forEach(metricPack => {
    if (metricPack?.name) {
      metricPackMapApi.set(metricPack.name, metricPack)
    }
  })
}

export async function fetchMetricPacks(
  ...params: Parameters<typeof CVNextGenCVConfigService['fetchMetricPacks']>
): Promise<{ error?: string; metricPackMap?: Map<string, MetricPack> }> {
  xhr.abort(params[0].group)
  const { error: apiError, response, status } = await CVNextGenCVConfigService.fetchMetricPacks(params[0])
  if (status === xhr.ABORTED) {
    return {}
  } else if (apiError) {
    return { error: apiError }
  } else {
    const metricPackMapApi = new Map<string, MetricPack>()
    const resp: any = response
    resp?.resource?.forEach((mp: any) => metricPackMapApi.set(mp.name, mp))
    return { metricPackMap: metricPackMapApi }
  }
}

export function useMetricPackHook(configMetricPack: MetricPack[], metricPackMap: Map<string, MetricPack>) {
  const [selectedMetricPacks, setSelectedPacks] = useState(configMetricPack || [])
  const [configMetricPackMap, setConfigMetricMapPack] = useState(metricPackMap)

  // update stored metric pack whenever the configMetricPack changes
  useEffect(() => {
    const newMap = new Map(metricPackMap)
    metricPackMap.forEach(pack => {
      if (pack.name) {
        newMap.set(pack.name, { ...pack, metrics: pack.metrics?.map(metric => ({ ...metric })) || [] })
      }
    })
    transformConfigMetricPackToMap(configMetricPack || [], newMap)
    setConfigMetricMapPack(newMap)
  }, [configMetricPack, metricPackMap])

  // setter function for when the metric objects are updated
  const setMetricObjectCallback = useCallback(
    (updatedMetricPacks: MetricPack[]) => {
      const newMap = new Map(metricPackMap)
      transformConfigMetricPackToMap(updatedMetricPacks, newMap)
      setConfigMetricMapPack(newMap)
    },
    [metricPackMap]
  )

  // setter function to update selected pack with metric pack names
  const setSelectedPackCallback = useCallback(
    (selectedPacks: string[]) => {
      const newSelectedPackObjs: MetricPack[] = []
      for (const selectedPack of selectedPacks) {
        const pack: MetricPack | undefined = configMetricPackMap.get(selectedPack)
        if (pack) {
          newSelectedPackObjs.push(pack)
        }
      }
      setSelectedPacks(newSelectedPackObjs)
      return newSelectedPackObjs
    },
    [configMetricPackMap]
  )

  const selectedMetricPackObjs = useMemo(
    () => selectedMetricPacks.map(pack => configMetricPackMap.get(pack?.name || '')),
    [selectedMetricPacks, configMetricPackMap]
  )

  return useMemo(
    () => ({
      metricList: Array.from(configMetricPackMap.keys()),
      setMetricObject: setMetricObjectCallback,
      selectedMetricPackObjs,
      setSelectedPacks: setSelectedPackCallback
    }),
    [configMetricPackMap, setMetricObjectCallback, selectedMetricPackObjs, setSelectedPackCallback]
  )
}
