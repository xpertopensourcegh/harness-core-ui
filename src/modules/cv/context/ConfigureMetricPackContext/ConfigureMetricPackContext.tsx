import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react'
import { VerificationService } from 'services'
import xhr from '@wings-software/xhr-async'
import { useRoute } from 'hooks/useRoute'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'
interface ConfigureMetricPackProviderProps {
  dataSourceType: string
}

export const ConfigureMetricPackContext = createContext<{
  metricList: string[]
  getMetricObject: (metricName: string) => any
  error?: string
  isLoading: boolean
}>({ metricList: [], getMetricObject: () => undefined, isLoading: true, error: undefined })

export const ConfigureMetricPackProvider: React.FC<ConfigureMetricPackProviderProps> = props => {
  const { children, dataSourceType } = props
  const [metricPackMap, setMetricPackMap] = useState(new Map())
  const [{ isLoading, error }, setLoadingAndError] = useState({ isLoading: true, error: '' })
  const { params } = useRoute()

  useEffect(() => {
    VerificationService.fetchMetricPacks({
      accountId: params.accountId,
      projectId: 1234,
      dataSourceType,
      excludeDetails: false,
      group: XHR_METRIC_PACK_GROUP
    }).then(({ error, metricPacks, status }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (error) {
        setLoadingAndError({ isLoading: false, error })
      } else {
        const metricPackMap = new Map()
        metricPacks?.forEach(mp => metricPackMap.set(mp.name, mp))
        setLoadingAndError({ isLoading: false, error: '' })
        setMetricPackMap(metricPackMap)
      }
    })
    return () => xhr.abort(XHR_METRIC_PACK_GROUP)
  }, [dataSourceType, params])

  const getMetricObjectCallback = useCallback(() => (metricName: string) => metricPackMap.get(metricName), [
    metricPackMap
  ])
  const contextInput = useMemo(
    () => ({
      isLoading,
      error,
      metricList: Array.from(metricPackMap.keys()),
      getMetricObject: getMetricObjectCallback()
    }),
    [error, getMetricObjectCallback, isLoading, metricPackMap]
  )
  return <ConfigureMetricPackContext.Provider value={contextInput}>{children}</ConfigureMetricPackContext.Provider>
}
