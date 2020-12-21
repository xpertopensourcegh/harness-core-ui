import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'

import type { InputSetSelectorProps } from '@pipeline/components/InputSetSelector/InputSetSelector'
import type { PipelineType, ProjectPathProps } from '@common/interfaces/RouteInterfaces'

export interface RunPipelineModalProps {
  children: React.ReactNode
  pipelineIdentifier: string
  inputSetSelected?: InputSetSelectorProps['value']
  className?: string
}

export const RunPipelineModal: React.FC<RunPipelineModalProps> = ({
  children,
  inputSetSelected,
  pipelineIdentifier,
  className = ''
}): JSX.Element => {
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<PipelineType<ProjectPathProps>>()

  const history = useHistory()

  const runPipeline = (): void => {
    if (!inputSetSelected) {
      history.push(
        routes.toRunPipeline({
          accountId,
          orgIdentifier,
          projectIdentifier,
          pipelineIdentifier,
          module
        })
      )
    } else {
      history.push(
        `${routes.toRunPipeline({
          accountId,
          orgIdentifier,
          projectIdentifier,
          pipelineIdentifier,
          module
        })}?inputSetType=${inputSetSelected?.[0].type}&inputSetLabel=${inputSetSelected?.[0].label}&inputSetValue=${
          inputSetSelected[0].value as string
        }`
      )
    }
  }

  return (
    <span
      className={className}
      onClick={e => {
        e.stopPropagation()
        runPipeline()
      }}
    >
      {children}
    </span>
  )
}
