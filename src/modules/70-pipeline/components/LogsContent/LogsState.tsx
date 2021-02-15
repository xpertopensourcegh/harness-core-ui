import produce from 'immer'
import { set, findLast } from 'lodash-es'

import type { ExecutionNode } from 'services/cd-ng'
import {
  isExecutionComplete,
  isExecutionSuccess,
  isExecutionFailed,
  isExecutionRunning,
  isExecutionRunningLike
} from '@pipeline/utils/statusHelpers'
import type { MultiLogsViewerData, LogViewerSectionStatus } from '@common/components/MultiLogsViewer/MultiLogsViewer'
import { LITE_ENGINE_TASK } from '@pipeline/utils/executionUtils'
import type { ExecutionPathProps } from '@common/interfaces/RouteInterfaces'

export enum ActionType {
  CreateSections = 'CreateSections',
  FetchSectionData = 'FetchSectionData',
  UpdateSectionData = 'UpdateSectionData',
  ToggleSection = 'ToggleSection'
}

export interface LogSectionData extends MultiLogsViewerData {
  logKey: string
  dataSource: 'blob' | 'stream'
}

export interface CreateSectionsPayload extends ExecutionPathProps {
  node: ExecutionNode
  module: 'cd' | 'ci' | 'unknown'
  stageIdentifier: string
  stageStatus?: string
  runSequence?: number
  selectedStep: string
}

export interface Action<T extends ActionType> {
  type: T
  payload: T extends ActionType.CreateSections
    ? CreateSectionsPayload
    : T extends ActionType.FetchSectionData
    ? string
    : T extends ActionType.UpdateSectionData
    ? string
    : T extends ActionType.ToggleSection
    ? string
    : never
}

export interface State {
  key: null | string
  units: string[]
  dataMap: Record<string, LogSectionData>
  selectedStep: string
}

const LOG_TYPE_LENGTH = 4
const TIMESTAMP_LENGTH = 24
const logViewerStatusMap: Record<string, LogViewerSectionStatus> = {
  failed: 'error',
  failure: 'error',
  success: 'success'
}

export function reducer<T extends ActionType>(state: State, action: Action<T>): State {
  switch (action.type) {
    // Action for creating the sections
    case ActionType.CreateSections: {
      const {
        node,
        module,
        accountId,
        orgIdentifier,
        pipelineIdentifier,
        projectIdentifier,
        runSequence,
        stageIdentifier,
        selectedStep,
        stageStatus
      } = (action as Action<ActionType.CreateSections>).payload

      if (!node) return state

      const isSameStep = selectedStep === state.selectedStep

      if (module === 'ci') {
        const units = ['Logs']

        const dataSource =
          (node.stepType === 'dependency-service' && isExecutionRunningLike(stageStatus)) ||
          isExecutionRunningLike(node.status)
            ? 'stream'
            : 'blob'

        const sectionData: LogSectionData = {
          title: 'Logs',
          id: 'Logs',
          data: isSameStep ? state.dataMap?.Logs?.data || '' : '',
          dataSource,
          isOpen: isSameStep ? state.dataMap?.Logs?.isOpen : dataSource === 'stream',
          logKey:
            node.stepType === LITE_ENGINE_TASK
              ? ((node.executableResponses || []).find(item => item.task)?.task as any)?.logKeys?.[0]
              : `${accountId}/${orgIdentifier}/${projectIdentifier}/${pipelineIdentifier}/${runSequence}/${stageIdentifier}/${node?.identifier}`
        }

        return { units, dataMap: { [units[0]]: sectionData }, key: units[0], selectedStep }
      } else if (module === 'cd') {
        /**
         * task object must always be picked from the first entry
         * in `executableResponses`
         *
         * It can be either be a `taskChain` or a `task`
         */
        const task = node?.executableResponses?.[0]?.taskChain || node?.executableResponses?.[0]?.task

        /**
         * taskId to use to pick the progress data
         * NOTE: second element for progress
         */
        const taskId =
          node?.executableResponses?.[1]?.taskChain?.taskId || node?.executableResponses?.[0]?.task?.taskId || ''

        const { units = [], logKeys = [] } = task || ({} as any)

        /**
         * `taskIdToProgressDataMap` is an array with statuses for all the units.
         * It may have multiple entries for a given unit.
         * We must use the latest one always.
         *
         * Hence we loop over the entries nand create a map out of it.
         */
        const progressMap = new Map<string, string>()

        ;(node?.taskIdToProgressDataMap?.[taskId] || []).forEach(row => {
          if (row.commandUnitName && row.commandExecutionStatus) {
            progressMap.set(row.commandUnitName, row.commandExecutionStatus)
          }
        }, {})

        const isStepComplete = isExecutionComplete(node.status)

        const getStatusforUnit = (unit: string): string => {
          return (isStepComplete ? node.status : progressMap.get(unit)) || node.status || ''
        }

        const dataMap = units.reduce((acc: Record<string, LogSectionData>, unit: string, i: number) => {
          /**
           * progressMap must have a status for this unit.
           * In case it doesn't, fallback to the step status.
           */
          const unitStatus = getStatusforUnit(unit)

          acc[unit] = {
            title: unit,
            id: unit,
            data: isSameStep ? state.dataMap[unit]?.data || '' : '',
            isLoading: false,
            logKey: logKeys[i],
            isOpen: isSameStep ? state.dataMap[unit]?.isOpen : false,
            status: logViewerStatusMap[unitStatus.toLowerCase()],
            dataSource: isStepComplete ? 'blob' : 'stream'
          }

          return acc
        }, {})

        let key: string | null = null

        if (isStepComplete) {
          const isStepSuccess = isExecutionSuccess(node.status)

          // if step is successful
          if (isStepSuccess) {
            // open the first section
            key = units[0]
          } else {
            // find and open the first failed section
            const failedUnit = units.find((unit: string) => isExecutionFailed(getStatusforUnit(unit)))
            key = failedUnit || null
          }

          // if we are openening a section the set it to loading for better UX
          if (key) set(dataMap[key], 'isLoading', true)
        } else {
          // open the running section
          const runningUnit = findLast([...progressMap.keys()], unit => isExecutionRunning(getStatusforUnit(unit)))
          key = runningUnit || null
        }

        if (!key) {
          key = selectedStep === state.selectedStep ? state.key : null
        }

        return { units, dataMap, key, selectedStep }
      }

      return state
    }
    // Action for fetching the section data
    case ActionType.FetchSectionData: {
      const payload = (action as Action<ActionType.FetchSectionData>).payload
      return produce(state, draft => {
        set(draft.dataMap[payload], 'isLoading', true)
        draft.key = payload
      })
    }
    // Action for upodating the section data
    case ActionType.UpdateSectionData: {
      // TODO: handle streaming payload
      const payload = (action as Action<ActionType.UpdateSectionData>).payload
      const key = state.key

      if (!key || state.dataMap[key].data === payload) return state

      return produce(state, draft => {
        const data = payload.split('\n').reduce((str, line) => {
          if (line.length > 0) {
            let lineStr = line

            try {
              const { level, time, out } = JSON.parse(line) as Record<string, string>

              // fix padding in timestamp
              const timeStr = time.padEnd?.(TIMESTAMP_LENGTH, ' ') || time

              // clean up the out string and add left padding to make it align correctly
              const outStr = out
                .trim()
                .split('\n')
                .map((l, i) => (i === 0 ? l : `${' '.repeat(LOG_TYPE_LENGTH)}\t${' '.repeat(TIMESTAMP_LENGTH)}\t${l}`))
                .join('\n')

              lineStr = `${level}\t${timeStr}\t${outStr}`
            } catch (e) {
              //
            }

            lineStr = lineStr.trim()

            if (lineStr.length > 0) {
              return `${str}\n${lineStr}`
            }
          }

          return str
        }, '')
        set(draft.dataMap[key], 'isLoading', false)
        set(draft.dataMap[key], 'isOpen', true)
        set(draft.dataMap[key], 'data', data.trim())
        if (draft.dataMap[key]?.dataSource === 'blob') {
          draft.key = null
        }
      })
    }
    // Action for toggling a section
    case ActionType.ToggleSection: {
      const payload = (action as Action<ActionType.ToggleSection>).payload
      return produce(state, draft => {
        set(draft.dataMap[payload], 'isOpen', !state.dataMap[payload].isOpen)
      })
    }
    default:
      return state
  }
}
