import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react'
import xhr from '@wings-software/xhr-async'
import { CVNextGenCVConfigService } from 'modules/cv/services'
import type { CVConfig } from '@wings-software/swagger-ts/definitions'

const XHR_METRIC_PACK_GROUP = 'XHR_METRIC_PACK_GROUP'
interface ConfigureMetricPackProviderProps {
  dataSourceType: CVConfig['type']
}

// const metrics = [
//   {
//     uuid: null,
//     createdAt: 0,
//     lastUpdatedAt: 0,
//     accountId: 'kmpySmUISimoRrJL6NL73w',
//     projectId: '1234',
//     dataSourceType: null,
//     name: 'Quality',
//     metrics: [
//       {
//         name: 'Number of Errors',
//         path: 'Errors|__tier_name__|/__group_name__|Number of Errors',
//         validationPath: 'Overall Application Performance|__tier_name__|Exceptions per Minute',
//         included: true
//       },
//       {
//         name: 'Errors per Minute',
//         path: 'Errors|__tier_name__|/__group_name__|Errors per Minute',
//         validationPath: 'Overall Application Performance|__tier_name__|Errors per Minute',
//         included: true
//       }
//     ]
//   },
//   {
//     uuid: null,
//     createdAt: 0,
//     lastUpdatedAt: 0,
//     accountId: 'kmpySmUISimoRrJL6NL73w',
//     projectId: '1234',
//     dataSourceType: null,
//     name: 'Performance and Availability',
//     metrics: [
//       {
//         name: 'Stall Count',
//         path: 'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Stall Count',
//         validationPath: 'Overall Application Performance|__tier_name__|Stall Count',
//         included: true
//       },
//       {
//         name: 'Normal Average Response Time (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Normal Average Response Time (ms)',
//         validationPath: null,
//         included: false
//       },
//       {
//         name: 'Number of Very Slow Calls',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Number of Very Slow Calls',
//         validationPath: null,
//         included: false
//       },
//       {
//         name: 'Calls per Minute',
//         path: 'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Calls per Minute',
//         validationPath: 'Overall Application Performance|__tier_name__|Calls per Minute',
//         included: true
//       },
//       {
//         name: 'Average Response Time (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Average Response Time (ms)',
//         validationPath: 'Overall Application Performance|__tier_name__|Average Response Time (ms)',
//         included: true
//       },
//       {
//         name: 'Number of Slow Calls',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Number of Slow Calls',
//         validationPath: 'Overall Application Performance|__tier_name__|Number of Slow Calls',
//         included: false
//       },
//       {
//         name: '95th Percentile Response Time (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|95th Percentile Response Time (ms)',
//         validationPath: null,
//         included: false
//       },
//       {
//         name: 'Average Block Time (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Average Block Time (ms)',
//         validationPath: null,
//         included: false
//       },
//       {
//         name: 'Average CPU Used (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Average CPU Used (ms)',
//         validationPath: null,
//         included: false
//       },
//       {
//         name: 'Errors per Minute',
//         path: 'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Errors per Minute',
//         validationPath: 'Overall Application Performance|__tier_name__|Errors per Minute',
//         included: true
//       },
//       {
//         name: 'Average Wait Time (ms)',
//         path:
//           'Business Transaction Performance|Business Transactions|__tier_name__|/__group_name__|Average Wait Time (ms)',
//         validationPath: null,
//         included: false
//       }
//     ]
//   },
//   {
//     uuid: null,
//     createdAt: 0,
//     lastUpdatedAt: 0,
//     accountId: 'kmpySmUISimoRrJL6NL73w',
//     projectId: '1234',
//     dataSourceType: null,
//     name: 'Resources',
//     metrics: [
//       {
//         name: 'CPU.User',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|User',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|User',
//         included: false
//       },
//       {
//         name: 'CPU.%Busy',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Busy',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Busy',
//         included: true
//       },
//       {
//         name: 'CPU.%Idle',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Idle',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Idle',
//         included: false
//       },
//       {
//         name: 'CPU.%Stolen',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Stolen',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|%Stolen',
//         included: false
//       },
//       {
//         name: 'CPU.IOWait',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|IOWait',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|IOWait',
//         included: false
//       },
//       {
//         name: 'CPU.System',
//         path: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|System',
//         validationPath: 'Application Infrastructure Performance|__tier_name__|Hardware Resources|CPU|System',
//         included: false
//       }
//     ]
//   }
// ]

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

  useEffect(() => {
    CVNextGenCVConfigService.fetchMetricPacks({
      accountId: 'kmpySmUISimoRrJL6NL73w',
      projectId: 1234,
      dataSourceType,
      excludeDetails: false,
      group: XHR_METRIC_PACK_GROUP
    }).then(({ error: apiError, response, status }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (apiError) {
        setLoadingAndError({ isLoading: false, error: apiError })
      } else {
        const metricPackMapApi = new Map()
        const resp: any = response
        resp?.resource?.forEach((mp: any) => metricPackMapApi.set(mp.name, mp))
        setLoadingAndError({ isLoading: false, error: '' })
        setMetricPackMap(metricPackMapApi)
      }
    })
    return () => xhr.abort(XHR_METRIC_PACK_GROUP)
  }, [dataSourceType])

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
