import React from 'react'
import { LogViewer, Container, LogViewerProps, Collapse, CollapseList, Icon, Button } from '@wings-software/uikit'
import i18n from './LogViewContainer.i18n'
import css from './LogViewContainer.module.scss'

export interface LogViewContainerProps {
  logsViewerSections: LogViewerProps
  downloadLogs: () => void
}

const LogViewContainer: React.FC<LogViewContainerProps> = props => {
  // TODO: add heading when api start providing it
  const createConsoleBody = () => {
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
        <span>{i18n.consoleHeading}</span>
        <span className={css.hederButtons}>
          <Icon name="main-search" />
          <Button onClick={props.downloadLogs} minimal>
            <Icon name="download" />
          </Button>
        </span>
      </div>
      <Container>
        <div className={css.consoleBody}>{createConsoleBody()}</div>
      </Container>
      <div className={css.consoleFooter}>
        <p>{i18n.summary}</p>
      </div>
    </Container>
  )
}
export default LogViewContainer
