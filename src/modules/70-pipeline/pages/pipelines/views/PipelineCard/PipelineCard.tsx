import React from 'react'
import { Card, Text, Color, Container, Button, Layout, SparkChart, CardBody, Tag } from '@wings-software/uicore'
import { Classes, Intent, Menu } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { useConfirmationDialog, useToaster } from '@common/exports'
import { RunPipelineModal } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { PMSPipelineSummaryResponse, useSoftDeletePipeline } from 'services/pipeline-ng'
import { String, useStrings } from 'framework/exports'
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
  refetchPipeline: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ pipeline, goToPipelineStudio, refetchPipeline }): JSX.Element => {
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
    <Menu style={{ minWidth: 'unset' }}>
      <RunPipelineModal pipelineIdentifier={pipeline.identifier || /* istanbul ignore next */ ''}>
        <Menu.Item icon="play" text={getString('runPipelineText')} />
      </RunPipelineModal>
      <Menu.Item
        icon="cog"
        text={getString('pipelineStudio')}
        onClick={() => {
          goToPipelineStudio(pipeline.identifier)
        }}
      />
      <Menu.Divider />
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
  return (
    <Card className={css.pipelineCard}>
      <Container padding={{ left: 'xlarge', right: 'xlarge', bottom: 'large' }}>
        <div className={css.tags}>
          <Tag intent={Intent.PRIMARY} minimal>
            <String stringID="pipeline-list.readyToRun" />
          </Tag>

          <CardBody.Menu
            menuContent={
              <ContextMenu
                pipeline={pipeline}
                goToPipelineStudio={goToPipelineStudio}
                refetchPipeline={refetchPipeline}
              />
            }
            menuPopoverProps={{
              className: Classes.DARK
            }}
            className={css.menu}
          />
        </div>

        <Text
          font="medium"
          color={Color.BLACK}
          data-testid={pipeline.identifier}
          className={css.clickable}
          onClick={() => goToPipelineDetail(pipeline.identifier)}
        >
          {pipeline.name}
        </Text>
        {pipeline.description ? (
          <Text font="small" lineClamp={2} padding={{ top: 'small' }}>
            {pipeline.description}
          </Text>
        ) : null}
      </Container>
      {pipeline.tags ? (
        <Layout.Horizontal padding="small" spacing="small">
          {Object.keys(pipeline.tags).map(key => {
            const value = pipeline.tags?.[key]
            return (
              <Tag className={css.cardTags} key={key}>
                {value ? `${key}:${value}` : key}
              </Tag>
            )
          })}
        </Layout.Horizontal>
      ) : null}
      <Container
        padding="medium"
        border={{ top: true, color: Color.GREY_250 }}
        className={css.clickable}
        onClick={() => goToPipelineDetail(pipeline.identifier)}
      >
        <Layout.Horizontal flex={{ distribution: 'space-between' }} style={{ alignItems: 'flex-end' }}>
          <Layout.Vertical flex={{ align: 'center-center' }} spacing="xsmall">
            <Text
              icon="step-group"
              color={Color.BLACK}
              font="small"
              iconProps={{ size: 12 }}
              style={{ textTransform: 'capitalize' }}
            >
              {pipeline.numOfStages}&nbsp;
              <String stringID="pipeline-list.listStages" />
            </Text>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              <String stringID="pipeline-list.listStages" />
            </Text>
          </Layout.Vertical>
          <Layout.Vertical flex={{ align: 'center-center' }} spacing="xsmall">
            <span className={css.activityChart}>
              <SparkChart data={pipeline.executionSummaryInfo?.deployments || /* istanbul ignore next */ []} />
            </span>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              <String stringID="activity" />
            </Text>
          </Layout.Vertical>
          <Layout.Vertical flex={{ align: 'center-center' }} spacing="xsmall">
            <Text color={Color.RED_600}>{pipeline.executionSummaryInfo?.numOfErrors || '-'}</Text>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              <String stringID="errors" />
            </Text>
          </Layout.Vertical>
        </Layout.Horizontal>
      </Container>
      <Container padding="medium" border={{ top: true, color: Color.GREY_250 }} className={css.runPipeline}>
        <RunPipelineModal pipelineIdentifier={pipeline.identifier || /* istanbul ignore next */ ''}>
          <Button
            data-testid="card-run-pipeline"
            intent="primary"
            icon="run-pipeline"
            text={<String stringID="runPipelineText" />}
          />
        </RunPipelineModal>
      </Container>
    </Card>
  )
}
