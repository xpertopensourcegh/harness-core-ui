import { useState, useCallback } from 'react'
import type { AppStore } from 'framework'
import constate from 'constate'

function useAppState(): { store: AppStore; updateStore: (newState: Partial<AppStore>) => void } {
  const [store, setStore] = useState({} as AppStore)
  const updateStore = useCallback(
    (newState: Partial<AppStore>) => setStore(currentState => ({ ...currentState, ...newState })),
    []
  )

  return { store, updateStore }
}

const [AppStoreProvider, useAppStoreReader, useAppStoreWriter] = constate(
  useAppState,
  value => value.store,
  value => value.updateStore
)

export { AppStoreProvider, useAppStoreReader, useAppStoreWriter }
