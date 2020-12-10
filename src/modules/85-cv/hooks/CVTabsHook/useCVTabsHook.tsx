import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useToaster } from '@common/exports'
import { ONBOARDING_ENTITIES, BaseSetupTabsObject } from '@cv/pages/admin/setup/SetupUtils'

import { SETUP_INDEXDB_ID } from '@cv/constants'
import routes from '@common/RouteDefinitions'
import { getRoutePathByType } from '@cv/utils/routeUtils'
import { useIndexedDBHook, CVObjectStoreNames } from '../IndexedDBHook/IndexedDBHook'

export type OnClickHandlerParams<T> = {
  data?: T & BaseSetupTabsObject
  prevTab?: number
  newTab?: number
}

type CVTabsHookReturnType<T> = {
  currentTab: number
  setCurrentTab: (val: number) => void
  maxEnabledTab: number
  setMaxEnabledTab: (val: number) => void
  onNext: ({ data, prevTab, newTab }: OnClickHandlerParams<T>) => void
  onPrevious: (prevTab?: number, newTab?: number) => void
  currentData?: T
  setCurrentData: (data?: T) => void
}

const IndexDBSourceID = 'sourceID'

interface UseCVTabsHookProps {
  totalTabs: number
}

export default function useCVTabsHook<T>(props?: UseCVTabsHookProps): CVTabsHookReturnType<T> {
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [currentData, setCurrentData] = useState<T>()
  const [maxEnabledTab, setMaxEnabledTab] = useState<number>(1)
  const { showWarning } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()

  const { isInitializingDB, dbInstance } = useIndexedDBHook({
    clearStroreList: [CVObjectStoreNames.ONBOARDING_SOURCES]
  })

  useEffect(() => {
    if (!isInitializingDB && dbInstance) {
      dbInstance.get(CVObjectStoreNames.ONBOARDING_SOURCES, IndexDBSourceID)?.then(data => {
        if (data) {
          setCurrentData(data.currentData)
          setCurrentTab(data.currentTab)
          setMaxEnabledTab(data.maxEnabledTab)
        }
      })
    }
  }, [isInitializingDB, dbInstance])

  const setDBData = async (data: unknown, curTab: number, maxTab: number) => {
    try {
      await dbInstance?.put(CVObjectStoreNames.ONBOARDING_SOURCES, {
        sourceID: IndexDBSourceID,
        currentData: data,
        currentTab: curTab,
        maxEnabledTab: maxTab
      })
    } catch (e) {
      showWarning(e)
    }
  }
  const getRouteUrlForOnboarding = ({ type, sourceType, identifier }: any) => {
    if (sourceType === 'ACTIVITY_SOURCE') {
      return routes.toCVActivitySourceEditSetup({
        projectIdentifier,
        orgIdentifier,
        accountId,
        activitySource: getRoutePathByType(type),
        activitySourceId: identifier
      })
    } else if (sourceType === 'MONITORING_SOURCE') {
      return ''
      // Add edit route for monitoring
    }
  }
  return {
    currentTab,
    currentData,
    setCurrentData,
    setCurrentTab,
    maxEnabledTab,
    setMaxEnabledTab,
    onNext: async ({ data, prevTab, newTab }) => {
      if (props?.totalTabs === currentTab) {
        if (dbInstance) {
          dbInstance.get(CVObjectStoreNames.SETUP, SETUP_INDEXDB_ID)?.then(async resultData => {
            const item = [
              {
                type: data?.type,
                name: data?.name,
                identifier: data?.identifier,
                routeUrl: getRouteUrlForOnboarding({
                  type: data?.type,
                  sourceType: data?.sourceType,
                  identifier: data?.identifier
                })
              }
            ]
            try {
              await dbInstance.put(CVObjectStoreNames.SETUP, {
                setupID: SETUP_INDEXDB_ID,
                monitoringSources:
                  data?.sourceType === ONBOARDING_ENTITIES.MONITORING_SOURCE
                    ? resultData?.monitoringSources
                      ? resultData?.monitoringSources?.concat(item)
                      : item
                    : resultData?.monitoringSources,
                activitySources:
                  data?.sourceType === ONBOARDING_ENTITIES.ACTIVITY_SOURCE
                    ? resultData?.activitySources
                      ? resultData?.activitySources?.concat(item)
                      : item
                    : resultData?.activitySources
              })
            } catch (e) {
              showWarning(e)
            }
          })
        }
      } else {
        if (currentTab == maxEnabledTab) {
          await setDBData(data, currentTab + 1, maxEnabledTab + 1)
          setCurrentTab(currentTab + 1)
          setMaxEnabledTab(maxEnabledTab + 1)
        } else if (currentTab < maxEnabledTab) {
          if (prevTab && newTab) {
            await setDBData(currentData, newTab, maxEnabledTab)
            setCurrentTab(newTab)
          } else {
            await setDBData(data, currentTab + 1, maxEnabledTab)
            setCurrentTab(currentTab + 1)
          }
        }
      }
    },
    onPrevious: async (prevTab, newTab) => {
      if (prevTab && newTab) {
        await setDBData(currentData, newTab, maxEnabledTab)
        setCurrentTab(newTab)
      } else {
        await setDBData(currentData, currentTab - 1, maxEnabledTab)
        setCurrentTab(currentTab - 1)
      }
    }
  }
}
