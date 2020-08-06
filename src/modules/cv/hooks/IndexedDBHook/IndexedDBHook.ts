import { openDB, IDBPDatabase } from 'idb'
import { useEffect, useState } from 'react'
import SessionToken from 'framework/utils/SessionToken'

export const CVObjectStoreNames = {
  LIST_ENTITIES: 'datasourceListEntity',
  APPD_TIERS: 'appDTiers',
  ONBOARDING_JOURNEY: 'onBoardingJourney'
}

export const CVIndexedDBPrimaryKeys = {
  APPD_APP_NAME: 'applicationName',
  APPD_APP_ID: 'appId',
  DATASOURCE_ID: 'dataSourceId'
}

export const CVIndexedObjectStoreToPrimaryKey = {
  [CVObjectStoreNames.LIST_ENTITIES]: CVIndexedDBPrimaryKeys.DATASOURCE_ID,
  [CVObjectStoreNames.APPD_TIERS]: [CVIndexedDBPrimaryKeys.APPD_APP_ID, CVIndexedDBPrimaryKeys.DATASOURCE_ID],
  [CVObjectStoreNames.ONBOARDING_JOURNEY]: CVIndexedDBPrimaryKeys.DATASOURCE_ID
}

const OBJECT_STORES = [
  {
    name: CVObjectStoreNames.LIST_ENTITIES,
    options: { keyPath: CVIndexedObjectStoreToPrimaryKey[CVObjectStoreNames.LIST_ENTITIES], autoIncrement: false }
  },
  {
    name: CVObjectStoreNames.APPD_TIERS,
    options: {
      keyPath: CVIndexedObjectStoreToPrimaryKey[CVObjectStoreNames.APPD_TIERS],
      autoIncrement: false
    },
    index: {
      indexName: 'appDTiersIndex',
      property: CVIndexedObjectStoreToPrimaryKey[CVObjectStoreNames.APPD_TIERS],
      options: { multiEntry: false, unique: true }
    }
  },
  {
    name: CVObjectStoreNames.ONBOARDING_JOURNEY,
    options: { keyPath: CVIndexedDBPrimaryKeys.DATASOURCE_ID, autoIncrement: false },
    index: {
      indexName: 'onBoardingJourneyIndex',
      property: CVIndexedObjectStoreToPrimaryKey[CVObjectStoreNames.ONBOARDING_JOURNEY],
      options: { unique: true }
    }
  }
]

async function initializeCVDB(setDBInstance: (dbInstance?: IDBPDatabase) => void): Promise<IDBPDatabase> {
  const dbInstance = await openDB('CV-INDEXED-DB', SessionToken.getLastTokenSetTime() || new Date().getTime(), {
    upgrade(db) {
      for (const store of OBJECT_STORES) {
        const dbStore = db.createObjectStore(store.name, store.options)
        if (store.index) {
          const { indexName, property, options } = store.index
          dbStore.createIndex(indexName, property, options)
        }
      }
    },
    blocked() {
      dbInstance?.close()
      setDBInstance()
    },
    blocking() {
      dbInstance?.close()
      setDBInstance()
    }
  })
  return dbInstance
}

type CVIndexedDBHookReturnType = {
  isInitializingDB: boolean
  dbInstance?: IDBPDatabase
}

export function useIndexedDBHook(): CVIndexedDBHookReturnType {
  const [isInitializingDB, setInitializingDB] = useState<boolean>(true)
  const [dbInstance, setDBInstance] = useState<IDBPDatabase | undefined>()

  useEffect(() => {
    initializeCVDB(setDBInstance).then(db => {
      setDBInstance(db)
      setInitializingDB(false)
    })
  }, [])

  useEffect(() => () => dbInstance?.close(), [dbInstance?.close])

  return { isInitializingDB, dbInstance }
}
