import React from 'react'
import { LogViewer, Container, LogViewerProps, Collapse, CollapseList, Icon, Button } from '@wings-software/uikit'
import css from './LogViewContainer.module.scss'

export interface LogViewContainerProps {
  logsViewerSections: LogViewerProps
  downloadLogs: () => void
}

const LogViewContainer: React.FC<LogViewContainerProps> = props => {
  const createConsoleBody3 = () => {
    return (
      <CollapseList>
        <Collapse heading="Clone source code">
          <LogViewer logs={props.logsViewerSections.logs} />
        </Collapse>
      </CollapseList>
    )
  }

  return (
    <Container className={css.console}>
      <div className={css.consoleHeader}>
        <span>Step Logs</span>
        <span style={{ display: 'flex', alignItems: 'center', width: '70px', justifyContent: 'space-evenly' }}>
          <Icon name="main-search" />
          <Button onClick={props.downloadLogs} minimal>
            <Icon name="download" />
          </Button>
        </span>
      </div>
      <Container>
        <div className={css.consoleBody}>{createConsoleBody3()}</div>
      </Container>
      <div className={css.consoleFooter}>
        <p>Summary</p>
      </div>
    </Container>
  )
}
export default LogViewContainer
