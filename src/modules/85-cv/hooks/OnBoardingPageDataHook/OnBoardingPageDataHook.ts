import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { IDBPDatabase } from 'idb'
import { useIndexedDBHook, CVObjectStoreNames } from '../IndexedDBHook/IndexedDBHook'

type OnBoardingPageDataHookReturnType<T extends object> = {
  isInitializingDB: boolean
  dbInstance?: IDBPDatabase
  pageData?: T
}

export default function useOnBoardingPageDataHook<T extends object>(
  dataSourceId: string
): OnBoardingPageDataHookReturnType<T> {
  const { state: locationContext } = useLocation<T>()
  const { isInitializingDB, dbInstance } = useIndexedDBHook({})
  const [contextData, setContextData] = useState<T>({ ...locationContext })
  const [loadingContextData, setLoadingContextData] = useState<boolean>(Boolean(!locationContext))
  useEffect(() => {
    if (!isInitializingDB && !locationContext && dbInstance) {
      dbInstance.get(CVObjectStoreNames.ONBOARDING_JOURNEY, dataSourceId).then((data: T) => {
        setContextData(data || {})
        setLoadingContextData(false)
      })
    }
  }, [isInitializingDB, dbInstance, dataSourceId, locationContext])

  return {
    isInitializingDB: isInitializingDB || loadingContextData,
    dbInstance,
    pageData: contextData
  }
}
