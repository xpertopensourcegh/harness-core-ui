import React from 'react'
import { useParams, Link } from 'react-router-dom'

import { useGetToken, logBlobPromise } from 'services/logs'
import { String } from 'framework/exports'
import type { ExecutionPathProps } from '@common/interfaces/RouteInterfaces'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import SessionToken from 'framework/utils/SessionToken'
import { MultiLogsViewer, LogViewerAccordionProps } from '@common/components/MultiLogsViewer/MultiLogsViewer'
import { getStageType } from '@pipeline/utils/executionUtils'
import { isExecutionComplete, isExecutionRunningLike } from '@pipeline/utils/statusHelpers'
import { PQueue } from '@common/utils/PQueue'

import { useLogsStream } from './useLogsStream'
import { reducer, ActionType } from './LogsState'
import css from './LogsContent.module.scss'

const logsCache = new Map()
export const requestQueue = new PQueue()

export interface LogsContentProps {
  mode: 'step-details' | 'console-view'
  toConsoleView?: string
}

export function LogsContent(props: LogsContentProps): React.ReactElement {
  const { mode, toConsoleView = '' } = props
  const { accountId, pipelineIdentifier, projectIdentifier, executionIdentifier, orgIdentifier } = useParams<
    ExecutionPathProps
  >()
  const [state, dispatch] = React.useReducer(reducer, { units: [], dataMap: {}, selectedStep: '' })
  const {
    pipelineStagesMap,
    selectedStageId,
    allNodeMap,
    selectedStepId,
    logsToken,
    setLogsToken,
    pipelineExecutionDetail
  } = useExecutionContext()
  const { data: tokenData } = useGetToken({ queryParams: { accountID: accountId }, lazy: !!logsToken })
  const { log: streamData, startStream, closeStream, logKey: streamKey } = useLogsStream()

  const getBlobData = React.useCallback(
    (id: string, key: string) => {
      requestQueue.add(async (signal: AbortSignal) => {
        if (logsCache.has(key)) {
          dispatch({ type: ActionType.UpdateSectionData, payload: { data: logsCache.get(key), id } })
          return
        }

        dispatch({ type: ActionType.FetchSectionData, payload: id })

        const data = ((await logBlobPromise(
          {
            queryParams: {
              accountID: accountId,
              'X-Harness-Token': '',
              key
            },
            requestOptions: {
              headers: {
                'X-Harness-Token': logsToken
              }
            }
          },
          signal
        )) as unknown) as string

        logsCache.set(key, data)
        dispatch({ type: ActionType.UpdateSectionData, payload: { id, data } })
      })
    },
    [accountId, logsToken]
  )

  React.useEffect(() => {
    if (tokenData) {
      setLogsToken(tokenData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData])

  // This fetches data for sections that are opened initially
  React.useEffect(() => {
    state.units.forEach(unit => {
      const section = state.dataMap[unit]

      if (section && section.isLoading) {
        getBlobData(unit, section.logKey)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedStep])

  // fetch data for stream
  React.useEffect(() => {
    if (streamData) {
      dispatch({ type: ActionType.UpdateSectionData, payload: { data: streamData, id: streamKey } })
    }
  }, [streamData, streamKey, state.selectedStep])

  // on unmount
  React.useEffect(() => {
    return () => {
      requestQueue.cancel()
      closeStream()
      logsCache.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const selectedStep = allNodeMap[selectedStepId]
    const selectedStage = pipelineStagesMap.get(selectedStageId)

    dispatch({
      type: ActionType.CreateSections,
      payload: {
        node: selectedStep,
        module: getStageType(selectedStage),
        stageStatus: selectedStage?.status,
        accountId,
        pipelineIdentifier,
        projectIdentifier,
        executionIdentifier,
        orgIdentifier,
        stageIdentifier: selectedStage?.nodeIdentifier || '',
        runSequence: pipelineExecutionDetail?.pipelineExecutionSummary?.runSequence,
        selectedStep: selectedStepId
      }
    })
  }, [
    selectedStepId,
    allNodeMap,
    accountId,
    pipelineIdentifier,
    projectIdentifier,
    executionIdentifier,
    pipelineStagesMap,
    selectedStageId,
    orgIdentifier,
    pipelineExecutionDetail?.pipelineExecutionSummary?.runSequence
  ])

  function handleSectionClick(id: string, _props: LogViewerAccordionProps): boolean | void {
    const currentSection = state.dataMap[id]

    if (
      (!isExecutionComplete(currentSection.originalStatus) && !isExecutionRunningLike(currentSection.originalStatus)) ||
      currentSection.isLoading
    ) {
      return false
    }

    const key = currentSection.logKey

    if (!currentSection?.data) {
      if (currentSection.dataSource === 'blob') {
        getBlobData(id, key)
      } else if (currentSection.data === 'stream') {
        startStream({
          queryParams: {
            accountId,
            key
          },
          headers: {
            'X-Harness-Token': logsToken,
            Authorization: SessionToken.getToken()
          }
        })
      }
    } else {
      dispatch({ type: ActionType.ToggleSection, payload: id })
    }

    return false
  }

  const logViewerData = state.units.map(unit => ({ ...state.dataMap[unit] }))

  return (
    <div className={css.main} data-mode={mode}>
      <div className={css.header}>
        <String tagName="div" stringID={mode === 'console-view' ? 'execution.consoleLogs' : 'execution.stepLogs'} />
        <div>
          {mode === 'step-details' ? (
            <Link className={css.toConsoleView} to={toConsoleView}>
              <String stringID="consoleView" />
            </Link>
          ) : null}
        </div>
      </div>
      <div className={css.logViewer}>
        <MultiLogsViewer key={selectedStepId} data={logViewerData} onSectionClick={handleSectionClick} />
      </div>
    </div>
  )
}
