// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// TODO: Import type for recoil when it's merged
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/44756
import { useRecoilValue, useSetRecoilState, atom } from 'recoil'
import type { ApplicationState } from 'framework'

const applicationState = atom({
  key: 'applicationState',
  default: {}
})

export function useApplicationStateReader(): Readonly<ApplicationState> {
  return useRecoilValue(applicationState)
}

export type UseApplicationStateWriterResult = (callback: (previousState: ApplicationState) => ApplicationState) => void

export function useApplicationStateWriter(): UseApplicationStateWriterResult {
  return useSetRecoilState(applicationState)
}
