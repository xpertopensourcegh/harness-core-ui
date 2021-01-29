import React from 'react'
import { Card, Text, Color, Container, Button, Layout, SparkChart, CardBody, Tag, Icon } from '@wings-software/uicore'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { useConfirmationDialog, useToaster } from '@common/exports'
import { RunPipelineModal } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { PMSPipelineSummaryResponse, useSoftDeletePipeline } from 'services/pipeline-ng'
import { String, useStrings } from 'framework/exports'
import { formatDatetoLocale } from '@common/utils/dateUtils'
import { getIconsForPipeline, getStatusColor } from '../../PipelineListUtils'
import css from '../../PipelinesPage.module.scss'

interface PipelineDTO extends PMSPipelineSummaryResponse {
  status?: string
}
export interface PipelineCardProps {
  pipeline: PipelineDTO
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

interface ContextMenuProps {
  pipeline: PMSPipelineSummaryResponse
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  pipeline,
  goToPipelineStudio,
  refetchPipeline,
  goToPipelineDetail
}): JSX.Element => {
  const { showSuccess, showError } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { mutate: deletePipeline } = useSoftDeletePipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })
  const { getString } = useStrings()
  const { openDialog: confirmDelete } = useConfirmationDialog({
    contentText: getString('pipeline-list.confirmDelete', { name: pipeline.name }),
    titleText: getString('pipeline-list.confirmDeleteTitle'),
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async (isConfirmed: boolean) => {
      /* istanbul ignore else */
      if (isConfirmed) {
        try {
          const deleted = await deletePipeline(pipeline.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          /* istanbul ignore else */
          if (deleted.status === 'SUCCESS') {
            showSuccess(getString('pipeline-list.pipelineDeleted', { name: pipeline.name }))
          }
          refetchPipeline()
        } catch (err) {
          /* istanbul ignore next */
          showError(err?.data?.message)
        }
      }
    }
  })

  return (
    <Menu style={{ minWidth: 'unset' }} onClick={e => e.stopPropagation()}>
      <RunPipelineModal pipelineIdentifier={pipeline.identifier || /* istanbul ignore next */ ''}>
        <Menu.Item icon="play" text={getString('runPipelineText')} />
      </RunPipelineModal>
      <Menu.Item
        icon="cog"
        text={getString('launchStudio')}
        onClick={() => {
          goToPipelineStudio(pipeline.identifier)
        }}
      />
      <Menu.Item
        icon="list-detail-view"
        text={getString('viewExecutions')}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          goToPipelineDetail(pipeline.identifier)
        }}
      />
      <Menu.Divider />
      <Menu.Item
        icon="duplicate"
        text={getString('projectCard.clone')}
        disabled
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          return false
        }}
      />
      <Menu.Item
        icon="trash"
        text={getString('delete')}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          confirmDelete()
        }}
      />
    </Menu>
  )
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  pipeline,
  goToPipelineDetail,
  goToPipelineStudio,
  refetchPipeline
}): JSX.Element => {
  const { getString } = useStrings()
  const deployments = pipeline.executionSummaryInfo?.deployments?.reduce((acc, val) => acc + val, 0) || 0
  return (
    <Card className={css.pipelineCard} interactive onClick={() => goToPipelineStudio(pipeline.identifier)}>
      <Container padding={{ left: 'large', bottom: 'medium' }} className={css.pipelineTitle}>
        <span>
          {getIconsForPipeline(pipeline).map(iconObj => (
            <Icon key={iconObj.icon} name={iconObj.icon} size={iconObj.size} />
          ))}
        </span>
        <Text font="medium" color={Color.BLACK} data-testid={pipeline.identifier}>
          {pipeline.name}
        </Text>
        <CardBody.Menu
          menuContent={
            <ContextMenu
              pipeline={pipeline}
              goToPipelineStudio={goToPipelineStudio}
              goToPipelineDetail={goToPipelineDetail}
              refetchPipeline={refetchPipeline}
            />
          }
          menuPopoverProps={{
            className: Classes.DARK
          }}
          className={css.menu}
        />
      </Container>

      {!isEmpty(pipeline.description) ? (
        <Layout.Horizontal padding={{ left: 'large', bottom: 'medium', right: 'large' }}>
          <Text font="small" color={Color.GREY_400} lineClamp={2} tooltipProps={{ position: Position.BOTTOM }}>
            {pipeline.description}
          </Text>
        </Layout.Horizontal>
      ) : null}
      {!isEmpty(pipeline.tags) && pipeline.tags ? (
        <div className={css.tagRow}>
          {Object.keys(pipeline.tags).map(key => {
            const value = pipeline.tags?.[key]
            return (
              <Tag className={css.cardTags} key={key}>
                {value ? `${key}:${value}` : key}
              </Tag>
            )
          })}
        </div>
      ) : null}
      <Container
        padding={{ left: 'large', right: 'large', top: 'medium', bottom: 'small' }}
        border={{ top: true, color: Color.GREY_300 }}
      >
        <Text
          rightIcon={pipeline.executionSummaryInfo?.lastExecutionTs ? 'full-circle' : undefined}
          rightIconProps={{ color: getStatusColor(pipeline), size: 8, padding: { left: 'medium' } }}
          color={Color.GREY_400}
        >
          {pipeline.executionSummaryInfo?.lastExecutionTs
            ? `${getString('lastRunAtDate')}${formatDatetoLocale(pipeline.executionSummaryInfo?.lastExecutionTs)}`
            : getString('lastRunExecutionNever')}
        </Text>
        <Layout.Horizontal
          flex={{ distribution: 'space-between' }}
          padding={{ top: 'large', bottom: 'small' }}
          spacing="medium"
          style={{ alignItems: 'flex-end' }}
        >
          {deployments ? (
            <span className={css.activityChart}>
              <SparkChart
                data={pipeline.executionSummaryInfo?.deployments || []}
                data2={pipeline.executionSummaryInfo?.numOfErrors || []}
              />
            </span>
          ) : (
            <Text color={Color.GREY_400} font={{ size: 'xsmall' }}>
              {getString('emptyDeployments')}
            </Text>
          )}
          <Layout.Horizontal>
            <Text color={Color.GREY_400} font="medium" iconProps={{ size: 18 }}>
              {deployments}
            </Text>

            <Text
              color={deployments ? Color.BLUE_500 : Color.GREY_400}
              className={`${deployments ? css.clickable : ''}`}
              font="small"
              lineClamp={2}
              style={{ maxWidth: 90, paddingLeft: 'var(--spacing-small)' }}
              onClick={event => {
                event.stopPropagation()
                goToPipelineDetail(pipeline.identifier)
              }}
            >
              {getString('pipelineActivityLabel')}
            </Text>
          </Layout.Horizontal>
        </Layout.Horizontal>
      </Container>
      <Container padding={{ left: 'large', right: 'large', bottom: 'small' }}>
        <RunPipelineModal pipelineIdentifier={pipeline.identifier || /* istanbul ignore next */ ''}>
          <Button
            data-testid="card-run-pipeline"
            intent="primary"
            icon="run-pipeline"
            className={css.runPipelineBtn}
            text={<String stringID="runPipelineText" />}
          />
        </RunPipelineModal>
      </Container>
    </Card>
  )
}
