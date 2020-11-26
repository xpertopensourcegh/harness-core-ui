import React from 'react'
import { Button } from '@wings-software/uikit'
// import cx from 'classnames'
import { String } from 'framework/exports'

import css from './ExecutionsFilter.module.scss'

interface ExecutionFilterProps {
  onRunPipeline(): void
}

export default function ExecutionFilter(props: ExecutionFilterProps): React.ReactElement {
  return (
    <div className={css.main}>
      <Button icon="cube" intent="primary">
        <String className={css.runText} stringID="runPipelineText" onClick={props.onRunPipeline} />
      </Button>
    </div>
  )
}
