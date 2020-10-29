import { createContext, useContext } from 'react'
import type { SetStateAction } from 'react'

export enum ExecutionLayoutState {
  NONE = 'NONE',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  FLOATING = 'FLOATING'
}

export interface ExecutionLayoutContextParams {
  layout: ExecutionLayoutState
  setLayout(action: SetStateAction<ExecutionLayoutState>): void
  primaryPaneSize: number
  setPrimaryPaneSize(action: SetStateAction<number>): void
  teritiaryPaneSize: number
  setTeritiaryPaneSize(action: SetStateAction<number>): void
}

export const ExecutionLayoutContext = createContext<ExecutionLayoutContextParams>({
  layout: ExecutionLayoutState.NONE,
  setLayout: /* istanbul ignore next */ () => void 0,
  primaryPaneSize: 0,
  teritiaryPaneSize: 0,
  setPrimaryPaneSize: /* istanbul ignore next */ () => void 0,
  setTeritiaryPaneSize: /* istanbul ignore next */ () => void 0
})

export function useExecutionLayoutContext(): ExecutionLayoutContextParams {
  return useContext(ExecutionLayoutContext)
}
