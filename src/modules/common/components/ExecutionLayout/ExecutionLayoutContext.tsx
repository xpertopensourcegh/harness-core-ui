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
  setLayout: () => void 0,
  primaryPaneSize: 0,
  teritiaryPaneSize: 0,
  setPrimaryPaneSize: () => void 0,
  setTeritiaryPaneSize: () => void 0
})

export function useExecutionLayoutContext(): ExecutionLayoutContextParams {
  return useContext(ExecutionLayoutContext)
}
