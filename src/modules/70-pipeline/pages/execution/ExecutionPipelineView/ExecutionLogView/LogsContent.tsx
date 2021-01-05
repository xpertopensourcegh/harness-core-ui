import React, { useState } from 'react'
import { Text, Color, MultiLogsViewer } from '@wings-software/uicore'
import LogsHeader from './LogsHeader'
import Summary from './Summary'

import css from './ExecutionLogView.module.scss'
interface HeaderProps {
  header?: string
  showCross?: boolean
  redirectToLogView?: any
}
const LogsContent = (props: HeaderProps) => {
  const arr = Array.from({ length: 4 }, () => false)
  arr[0] = true
  const [panelArr, setPanelArr] = useState(arr)
  const [searchDir, setDir] = useState('')
  const [highlightInd, sethighlightInd] = useState(0)
  const [openedIndex, setOpenedIndex] = useState(0)
  const [searchText, setSearchText] = useState('')

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
  return (
    <section className={css.logContent}>
      <LogsHeader onNext={onNext} onPrev={onPrev} searchDir={searchDir} {...props} />

      <MultiLogsViewer
        numberOfLogSections={4}
        titleForSection={sectionIndex => {
          switch (sectionIndex) {
            case 0:
              return 'Set up job'
            case 1:
              return 'Run actions/checkout@v2'
            case 2:
              return 'Run make'
            case 3:
              return 'Complete job'
          }
        }}
        sectionArr={panelArr}
        activePanel={openedIndex}
        isSectionOpen={(sectionIndex: number) => panelArr[sectionIndex]}
        rightElementForSection={() => {
          return <Text color={Color.GREY_100}>2m 38s</Text>
        }}
        logContentForSection={() => {
          return 'gyp ERR! stack Error: `gyp` failed with exit code: 1\ngyp ERR! System Darwin 19.6.0\ngyp ERR! node -v v14.5.0\nnode-pre-gyp ERR! not ok\nFailed to execute node-gyp'
        }}
        searchDir={searchDir}
        highlightedIndex={highlightInd}
        searchText={searchText}
        updateSection={(currentIndex: number, nextIndex = -1) => {
          if (nextIndex > -1) {
            panelArr[currentIndex] = false
            panelArr[nextIndex] = true
            setOpenedIndex(nextIndex)
          } else {
            panelArr[currentIndex] = !panelArr[currentIndex]
          }

          setPanelArr([...panelArr])
        }}
        style={{ background: '#0b0b0d !important' }}
        className={css.logViewer}
      />
      <Summary />
    </section>
  )
}

export default LogsContent
