import React, { useEffect, useCallback } from 'react'
import type { SelectOption } from '@wings-software/uicore'
import type { IDBPDatabase } from 'idb'
import type { DSConfig } from 'services/cv'
import { CVObjectStoreNames } from '@cv/hooks/IndexedDBHook/IndexedDBHook'

interface SaveToIndexedDBProps {
  pageData: PageData
  dbInstance?: IDBPDatabase
  configs: DSConfig[]
}

export type PageData = { products: string[]; selectedEntities?: SelectOption[]; dataSourceId: string; isEdit?: boolean }

export function SaveConfigToIndexedDB(props: SaveToIndexedDBProps): JSX.Element {
  const { pageData, dbInstance, configs } = props
  const onBeforeUnloadCallback = useCallback(() => {
    dbInstance?.put(CVObjectStoreNames.ONBOARDING_JOURNEY, {
      ...pageData,
      savedConfigs: configs
    })
    window.removeEventListener('beforeunload', onBeforeUnloadCallback)
  }, [dbInstance?.put, pageData, configs])
  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnloadCallback)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnloadCallback)
    }
  }, [dbInstance?.put, configs, pageData, onBeforeUnloadCallback])
  return <span />
}
