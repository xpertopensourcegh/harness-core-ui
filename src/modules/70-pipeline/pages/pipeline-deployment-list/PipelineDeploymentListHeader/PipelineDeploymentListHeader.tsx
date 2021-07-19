import React from 'react'
import { useParams } from 'react-router-dom'
import { Checkbox, Color } from '@wings-software/uicore'

import { String, useStrings } from 'framework/strings'
import type { PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'

import StatusSelect from '@pipeline/components/StatusSelect/StatusSelect'
import PipelineSelect from '@pipeline/components/PipelineSelect/PipelineSelect'
import { useUpdateQueryParams } from '@common/hooks'
import { Page } from '@common/exports'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import type { GetListOfExecutionsQueryParams } from 'services/pipeline-ng'
import RbacButton from '@rbac/components/Button/Button'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

import { useFiltersContext } from '../FiltersContext/FiltersContext'
import { ExecutionFilters } from './ExecutionFilters/ExecutionFilters'
import type { QuickStatusParam } from '../types'
import css from './PipelineDeploymentListHeader.module.scss'

export interface FilterQueryParams {
  query?: string
  pipeline?: string
  status?: ExecutionStatus | null
}
export interface PipelineDeploymentListHeaderProps {
  onRunPipeline(): void
}

const defaultPageNumber = 1

export function PipelineDeploymentListHeader(props: PipelineDeploymentListHeaderProps): React.ReactElement {
  const { module, pipelineIdentifier } = useParams<Partial<PipelineType<PipelinePathProps>>>()
  const { queryParams } = useFiltersContext()
  const { updateQueryParams } = useUpdateQueryParams<Partial<GetListOfExecutionsQueryParams>>()
  const { getString } = useStrings()

  function handleMyDeployments(isChecked: boolean): void {
    if (isChecked) {
      updateQueryParams({ myDeployments: true })
    } else {
      updateQueryParams({ myDeployments: [] as any }) // removes the param
    }
  }

  function handleStatusChange(status?: QuickStatusParam | null): void {
    if (status) {
      updateQueryParams({ status, page: defaultPageNumber })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateQueryParams({ status: [] as any }) // removes the param
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function handlePipelineChange(pipelineIdentifier?: string): void {
    if (pipelineIdentifier) {
      updateQueryParams({ pipelineIdentifier, page: defaultPageNumber })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateQueryParams({ pipelineIdentifier: [] as any }) // removes the param
    }
  }

  return (
    <Page.SubHeader className={css.main}>
      <div className={css.lhs}>
        <RbacButton
          icon="run-pipeline"
          intent="primary"
          onClick={props.onRunPipeline}
          permission={{
            resource: {
              resourceType: ResourceType.PIPELINE,
              resourceIdentifier: pipelineIdentifier || queryParams.pipelineIdentifier
            },
            permission: PermissionIdentifier.EXECUTE_PIPELINE,
            options: {
              skipCondition: ({ resourceIdentifier }) => !resourceIdentifier
            }
          }}
        >
          <String className={css.runText} stringID="runPipelineText" />
        </RbacButton>
        <Checkbox
          label={getString(module === 'ci' ? 'pipeline.myBuildsText' : 'pipeline.myDeploymentsText')}
          background={Color.PRIMARY_BG}
          color={Color.GREY_800}
          padding={{ top: 'small', bottom: 'small', left: 'xxlarge', right: 'medium' }}
          checked={queryParams.myDeployments}
          onChange={e => handleMyDeployments(e.currentTarget.checked)}
          border={{ color: Color.GREY_200, width: 1, style: 'solid' }}
          height={'32px'}
          className={css.myDeploymentsCheckbox}
        />
        <StatusSelect value={queryParams.status as ExecutionStatus} onSelect={handleStatusChange} />
        {pipelineIdentifier ? null : (
          <PipelineSelect selectedPipeline={queryParams.pipelineIdentifier} onPipelineSelect={handlePipelineChange} />
        )}
      </div>
      <div className={css.rhs}>
        <ExecutionFilters />
      </div>
    </Page.SubHeader>
  )
}
