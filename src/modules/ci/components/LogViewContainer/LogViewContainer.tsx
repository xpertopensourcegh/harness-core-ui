import React from 'react'
import { LogViewer, Container, LogViewerProps, Icon, Button } from '@wings-software/uikit'
import i18n from './LogViewContainer.i18n'
import css from './LogViewContainer.module.scss'

export interface LogViewContainerProps {
  logsViewerSections: LogViewerProps
  downloadLogs: () => void
  showSummary?: boolean
}

const LogViewContainer: React.FC<LogViewContainerProps> = props => {
  const { logsViewerSections, downloadLogs, showSummary = true } = props

  // TODO: add heading when api start providing it
  const createConsoleBody = () => {
    return <LogViewer defaultOptions={{ LogLimit: 500 }} logs={logsViewerSections.logs} />
  }

  return (
    <Container className={css.console}>
      <div className={css.consoleHeader}>
        <span>{i18n.consoleHeading}</span>
        <span className={css.hederButtons}>
          <Icon name="main-search" />
          <Button onClick={downloadLogs} minimal>
            <Icon name="download" />
          </Button>
        </span>
      </div>
      <Container className={css.consoleBody}>{createConsoleBody()}</Container>
      {showSummary && (
        <div className={css.consoleFooter}>
          <p>{i18n.summary}</p>
        </div>
      )}
    </Container>
  )
}
export default LogViewContainer
