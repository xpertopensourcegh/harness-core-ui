import React from 'react'
import { useParams, Link } from 'react-router-dom'

import { useGetToken, useLogBlob } from 'services/logs'
import { String } from 'framework/exports'
import type { ExecutionPathProps } from '@common/interfaces/RouteInterfaces'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import SessionToken from 'framework/utils/SessionToken'
import { MultiLogsViewer, LogViewerSectionProps } from '@common/components/MultiLogsViewer/MultiLogsViewer'
import { getStageType } from '@pipeline/utils/executionUtils'

import { useLogsStream } from './useLogsStream'
import { reducer, ActionType } from './LogsState'
import css from './LogsContent.module.scss'

const logsCache = new Map()

export interface LogsContentProps {
  mode: 'step-details' | 'console-view'
  toConsoleView?: string
}

export function LogsContent(props: LogsContentProps): React.ReactElement {
  const { mode, toConsoleView = '' } = props
  const { accountId, pipelineIdentifier, projectIdentifier, executionIdentifier, orgIdentifier } = useParams<
    ExecutionPathProps
  >()
  const [state, dispatch] = React.useReducer(reducer, { units: [], dataMap: {}, key: null, selectedStep: '' })
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
  const { data: logBlobData, refetch: fetchBlob, cancel } = useLogBlob({ lazy: true, localErrorOnly: true })
  const { log: streamData, startStream, closeStream } = useLogsStream()

  React.useEffect(() => {
    if (tokenData) {
      setLogsToken(tokenData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData])

  React.useEffect(() => {
    if (logBlobData && state.key) {
      const key = state.dataMap[state.key].logKey
      logsCache.set(key, logBlobData)
      dispatch({ type: ActionType.UpdateSectionData, payload: logBlobData })
    }
  }, [logBlobData, state.key, state.selectedStep])

  React.useEffect(() => {
    if (streamData) {
      dispatch({ type: ActionType.UpdateSectionData, payload: streamData })
    }
  }, [streamData, state.key, state.selectedStep])

  React.useEffect(() => {
    if (logsToken && state.key) {
      const dataSource = state.dataMap[state.key]?.dataSource
      const key = state.dataMap[state.key].logKey
      if (dataSource === 'blob') {
        if (logsCache.has(key)) {
          dispatch({ type: ActionType.UpdateSectionData, payload: logsCache.get(key) })
          return
        }
        fetchBlob({
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
        })
      } else if (dataSource === 'stream') {
        startStream({
          queryParams: {
            accountId,
            key: state.dataMap[state.key].logKey
          },
          headers: {
            'X-Harness-Token': logsToken,
            Authorization: SessionToken.getToken()
          }
        })
      }
    }

    return () => {
      closeStream()
      cancel()
      logsCache.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.key, logsToken, accountId, state.key ? state.dataMap[state.key]?.dataSource : null, state.selectedStep])

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

  function handleSectionClick(id: string, _props: LogViewerSectionProps): boolean | void {
    const currentSection = state.dataMap[id]

    if (!currentSection?.data) {
      dispatch({ type: ActionType.FetchSectionData, payload: id })
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
