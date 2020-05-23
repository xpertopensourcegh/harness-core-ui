import { useRecoilValue, useSetRecoilState } from 'recoil'
import { applicationState, ApplicationState } from '../models'

export function useApplicationStateReader(): Readonly<ApplicationState> {
  return useRecoilValue(applicationState)
}

export type UseApplicationStateWriterHook = (previousState: ApplicationState) => ApplicationState

export function useApplicationStateWriter(): UseApplicationStateWriterHook {
  return useSetRecoilState(applicationState)
}
