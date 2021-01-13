import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Text, Color, MultiLogsViewer } from '@wings-software/uicore'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import type { ExecutionPathParams } from '@pipeline/utils/executionUtils'
import LogsHeader from './LogsHeader'
import Summary from './Summary'
import { useExecutionContext } from '../../ExecutionContext/ExecutionContext'
import { createLogSection, getLogsFromBlob, getStageType, LogsContentSection } from './LogsContentUtils'
import { fetchLogsAccessToken } from '../../TokenService'
import { useLogsStream } from '../../LogsStreamHook'

import css from './ExecutionLogView.module.scss'

interface LogsContentProps {
  header?: string
  showCross?: boolean
  redirectToLogView?: any
  rows?: number
}

const LogsContent = (props: LogsContentProps) => {
  // >> NOTE: search functionality became buggy after latest update of MultiLogsViewer component
  const [searchDir, setDir] = useState('')
  const [highlightInd, sethighlightInd] = useState(0)
  const [openedIndex, setOpenedIndex] = useState(0)
  const [searchText, setSearchText] = useState('')

  const [openPanelArr, setOpenPanelArr] = useState<boolean[]>([])
  const [logsPerSection, setLogsPerSection] = useState<string[]>([])
  const [loadingIndex, setLoadingIndex] = useState(-1)
  const [touched, setTouched] = useState(false)
  const [latestSelectedIdx, setLatestSelectedIdx] = useState(-1)
  const [blobController, setBlobController] = useState<AbortController | undefined>()

  const { orgIdentifier, projectIdentifier, pipelineIdentifier, accountId } = useParams<
    PipelineType<ExecutionPathParams>
  >()

  const {
    pipelineStagesMap,
    allNodeMap,
    selectedStageId,
    selectedStepId,
    logsToken,
    setLogsToken,
    pipelineExecutionDetail
  } = useExecutionContext()

  const runSequence = (pipelineExecutionDetail?.pipelineExecutionSummary as any)?.runSequence // TODO: remove any once DTO is ready
  const stage = pipelineStagesMap.get(selectedStageId)
  const step = allNodeMap[selectedStepId]

  useEffect(() => {
    setTouched(false)
    setLatestSelectedIdx(-1)
  }, [(step as any)?.identifier]) // TODO: remove any once TDO is updated

  // get token for accessing logs
  useEffect(() => {
    /*getTokenPromise({ queryParams: { accountID: accountId } }).then((token: any) => {
      setLogsToken(token)
    })*/
    // TODO: temporary until PMS is available
    fetchLogsAccessToken(accountId).then((token: any) => {
      setLogsToken(token)
    })
  }, [])

  // get logs sections
  const logsSectionsModel: LogsContentSection[] = createLogSection(
    getStageType(stage),
    logsToken,
    accountId,
    orgIdentifier,
    projectIdentifier,
    runSequence,
    pipelineIdentifier,
    stage?.nodeIdentifier,
    stage?.status,
    step,
    touched,
    latestSelectedIdx
  )

  // set initial log arrays
  useEffect(() => {
    if (logsSectionsModel.length !== logsPerSection.length) {
      setLogsPerSection(new Array(logsSectionsModel.length))
    }
  }, [logsSectionsModel])

  // find active logs
  const activeLoadingSection = logsSectionsModel.find(item => item.enableLogLoading)

  // close all sections
  useEffect(() => {
    setOpenPanelArr(() => Array.from({ length: logsSectionsModel.length }, () => false))
  }, [logsSectionsModel.length])

  // setup logs stream
  const { logs: streamLogs, setEnableStreaming } = useLogsStream(activeLoadingSection?.queryVars)
  // add stream logs to section
  useEffect(() => {
    if (loadingIndex > -1) {
      logsPerSection[loadingIndex] = streamLogs.map(item => item.out).join('\n')
      setLogsPerSection([...logsPerSection])
    }
  }, [streamLogs])
  // load logs
  useEffect(() => {
    if (activeLoadingSection) {
      // abort prev stream
      setEnableStreaming(false)
      // abort previous fetch
      blobController?.abort?.()

      // clear logs
      logsPerSection[activeLoadingSection.sectionIdx] = ''
      setLogsPerSection([...logsPerSection])

      // set loading index
      setLoadingIndex(activeLoadingSection.sectionIdx)

      // load logs from blob or start stream
      switch (activeLoadingSection.sourceType) {
        case 'blob': {
          const controller = new AbortController()
          setBlobController(controller)
          getLogsFromBlob(activeLoadingSection.queryVars, controller.signal).then(response => {
            const logsPerSectionNew = [...logsPerSection]
            logsPerSectionNew[activeLoadingSection.sectionIdx] = response.map(item => item.out).join('\n')
            setLogsPerSection(logsPerSectionNew)
            setLoadingIndex(-1)
          })
          break
        }
        case 'stream': {
          setEnableStreaming(true)
          break
        }
      }
    }
  }, [logsToken, activeLoadingSection?.sectionIdx, (step as any)?.identifier]) // TODO: remove any once DTO is available

  useEffect(() => {
    // NOTE: auto open loading section and close other if user is not interacted with logs
    if (!touched && activeLoadingSection && activeLoadingSection?.sectionIdx > -1) {
      setOpenPanelArr(_openPanelArr => _openPanelArr.map((_, idx) => idx === activeLoadingSection?.sectionIdx))
    }
  }, [loadingIndex, touched])

  const onNext = (text: string) => {
    setSearchText(text)
    setDir(`next`)
    sethighlightInd(highlightInd + 1)
  }

  const onPrev = (text: string) => {
    setSearchText(text)
    setDir(`prev`)
    sethighlightInd(highlightInd - 1)
  }

  const logContentForSection = (sectionIdx: number): string => {
    if (logsPerSection[sectionIdx]) {
      return logsPerSection[sectionIdx]
    }
    return ''
  }

  return (
    <section className={css.logContent}>
      <LogsHeader
        onNext={onNext}
        onPrev={onPrev}
        searchDir={searchDir}
        header={props.header}
        showCross={props.showCross}
        redirectToLogView={props.redirectToLogView}
      />
      <MultiLogsViewer
        rows={props.rows || 20}
        loadingIndex={loadingIndex}
        numberOfLogSections={logsSectionsModel.length}
        titleForSection={sectionIndex => {
          return logsSectionsModel[sectionIndex].sectionTitle
        }}
        sectionArr={openPanelArr}
        activePanel={openedIndex}
        isSectionOpen={(sectionIndex: number) => openPanelArr[sectionIndex]}
        rightElementForSection={() => {
          return <Text color={Color.GREY_100}>2m 38s</Text>
        }}
        logContentForSection={logContentForSection}
        searchDir={searchDir}
        highlightedIndex={highlightInd}
        searchText={searchText}
        updateSection={(currentIndex: number, nextIndex = -1) => {
          if (nextIndex > -1) {
            openPanelArr[currentIndex] = false
            openPanelArr[nextIndex] = true
            setOpenedIndex(nextIndex)
          } else {
            openPanelArr[currentIndex] = !openPanelArr[currentIndex]
          }
        }}
        style={{ background: '#0b0b0d !important' }}
        className={css.logViewer}
        toggleSection={(index: number) => {
          // if it's open user want to close it / do not set latestSelectedIdx
          if (openPanelArr[index] !== true) {
            setLatestSelectedIdx(index)
          }
          setOpenPanelArr(openPanelArr.map((item, idx) => (index === idx ? !item : item)))
          setTouched(() => true)
        }}
      />
      <Summary />
    </section>
  )
}

export default LogsContent
