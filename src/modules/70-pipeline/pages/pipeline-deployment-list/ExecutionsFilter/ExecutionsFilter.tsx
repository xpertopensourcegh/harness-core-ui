import React from 'react'
import { Button } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'

import { String } from 'framework/exports'
import PipelineSelect from '@pipeline/components/PipelineSelect/PipelineSelect'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'

import css from './ExecutionsFilter.module.scss'

interface ExecutionFilterProps {
  onRunPipeline(): void
  selectedPipeline?: string
  setPipelineIdentifier(id: string): void
}

export default function ExecutionFilter(props: ExecutionFilterProps): React.ReactElement {
  const { pipelineIdentifier } = useParams<Partial<PipelinePathProps>>()

  return (
    <div className={css.main}>
      <div className={css.lhs}>
        <Button icon="cube" intent="primary">
          <String className={css.runText} stringID="runPipelineText" onClick={props.onRunPipeline} />
        </Button>
        {pipelineIdentifier ? null : (
          <div className={css.filterGroup}>
            <String className={css.label} stringID="pipelines" />
            <PipelineSelect selectedPipeline={props.selectedPipeline} onPipelineSelect={props.setPipelineIdentifier} />
          </div>
        )}
      </div>
      <div className={css.rhs}></div>
    </div>
  )
}
