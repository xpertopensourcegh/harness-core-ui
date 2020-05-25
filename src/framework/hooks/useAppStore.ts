// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// TODO: Import type for recoil when it's merged
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/44756
import { useRecoilValue, useSetRecoilState, atom } from 'recoil'
import type { AppStore } from 'framework'

const store = atom({ key: 'applicationStore', default: {} })

/**
 * Result type of useAppStoreWriter hook.
 */
export type UseAppStoreWriterResult = (callback: (previousState: AppStore) => AppStore) => void

/**
 * Hook to read from AppStore.
 */
export function useAppStoreReader(): Readonly<AppStore> {
  return useRecoilValue(store)
}

/**
 * Hook to write into AppStore.
 */
export function useAppStoreWriter(): UseAppStoreWriterResult {
  return useSetRecoilState(store)
}
