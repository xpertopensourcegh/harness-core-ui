import { createContext, useContext } from 'react'
import type { SetStateAction } from 'react'

export enum ExecutionLayoutState {
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
  isStepDetailsVisible: boolean
  setStepDetailsVisibility(action: SetStateAction<boolean>): void
}

export const ExecutionLayoutContext = createContext<ExecutionLayoutContextParams>({
  layout: ExecutionLayoutState.RIGHT,
  setLayout: /* istanbul ignore next */ () => void 0,
  primaryPaneSize: 0,
  teritiaryPaneSize: 0,
  setPrimaryPaneSize: /* istanbul ignore next */ () => void 0,
  setTeritiaryPaneSize: /* istanbul ignore next */ () => void 0,
  isStepDetailsVisible: false,
  setStepDetailsVisibility: /* istanbul ignore next */ () => void 0
})

export function useExecutionLayoutContext(): ExecutionLayoutContextParams {
  return useContext(ExecutionLayoutContext)
}
