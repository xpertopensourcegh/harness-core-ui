import React from 'react'
import { Card, Text, Color, Container, Button, Layout, SparkChart, Icon, CardBody, Tag } from '@wings-software/uikit'
import { Classes, Intent, Menu } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { CDPipelineSummaryResponseDTO, useSoftDeletePipeline } from 'services/cd-ng'
import { useConfirmationDialog, useToaster } from 'modules/common/exports'
import i18n from '../../CDPipelinesPage.i18n'
import css from '../../CDPipelinesPage.module.scss'

export interface PipelineCardProps {
  pipeline: CDPipelineSummaryResponseDTO
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  runPipeline: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

interface ContextMenuProps {
  pipeline: CDPipelineSummaryResponseDTO
  runPipeline: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  pipeline,
  goToPipelineStudio,
  runPipeline,
  refetchPipeline
}): JSX.Element => {
  const { showSuccess, showError } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { mutate: deletePipeline } = useSoftDeletePipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const { openDialog: confirmDelete } = useConfirmationDialog({
    contentText: i18n.confirmDelete(pipeline.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deletePipeline(pipeline.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted.status === 'SUCCESS') {
            showSuccess(i18n.pipelineDeleted(pipeline.name || ''))
          }
          refetchPipeline()
        } catch (err) {
          showError(err?.data?.message)
        }
      }
    }
  })

  return (
    <Menu style={{ minWidth: 'unset' }}>
      <Menu.Item
        icon="play"
        text={i18n.runPipeline}
        onClick={() => {
          runPipeline(pipeline.identifier)
        }}
      />
      <Menu.Item
        icon="cog"
        text={i18n.pipelineStudio}
        onClick={() => {
          goToPipelineStudio(pipeline.identifier)
        }}
      />
      <Menu.Divider />
      <Menu.Item
        icon="trash"
        text={i18n.delete}
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
  runPipeline,
  refetchPipeline
}): JSX.Element => {
  return (
    <Card className={css.pipelineCard}>
      <Container padding={{ left: 'xlarge', right: 'xlarge', bottom: 'large' }}>
        <CardBody.Menu
          menuContent={
            <ContextMenu
              pipeline={pipeline}
              goToPipelineStudio={goToPipelineStudio}
              runPipeline={runPipeline}
              refetchPipeline={refetchPipeline}
            />
          }
          menuPopoverProps={{
            className: Classes.DARK
          }}
          className={css.menu}
        />
        <span className={css.tags}>
          <Tag intent={Intent.PRIMARY} minimal>
            {i18n.readyToRun}
          </Tag>
        </span>
        <Text
          font="medium"
          color={Color.BLACK}
          className={css.clickable}
          onClick={() => goToPipelineDetail(pipeline.identifier)}
        >
          {pipeline.name}
        </Text>
        <Text font="small" padding={{ top: 'xsmall' }}>
          {pipeline.description}
        </Text>
        <Layout.Horizontal padding={{ top: 'medium' }}>
          <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall">
            <Icon name="main-user-groups" size={20} />
            <Text font="xsmall">{i18n.admin.toUpperCase()}</Text>
          </Layout.Vertical>
          <Layout.Vertical spacing="xsmall">
            <Icon name="main-user-groups" size={20} />
            <Text font="xsmall">{i18n.collaborators.toUpperCase()}</Text>
          </Layout.Vertical>
        </Layout.Horizontal>
      </Container>
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
              {pipeline.numOfStages} {i18n.stages}
            </Text>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              {i18n.stages}
            </Text>
          </Layout.Vertical>
          <Layout.Vertical flex={{ align: 'center-center' }} spacing="xsmall">
            <span className={css.activityChart}>
              <SparkChart data={pipeline.deployments || []} />
            </span>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              {i18n.activity}
            </Text>
          </Layout.Vertical>
          <Layout.Vertical flex={{ align: 'center-center' }} spacing="xsmall">
            <Text color={Color.RED_600}>{pipeline.numOfErrors || '-'}</Text>
            <Text color={Color.GREY_600} font={{ size: 'small' }} style={{ textTransform: 'uppercase' }}>
              {i18n.errors}
            </Text>
          </Layout.Vertical>
        </Layout.Horizontal>
      </Container>
      <Container padding="medium" border={{ top: true, color: Color.GREY_250 }} className={css.runPipeline}>
        <Button
          intent="primary"
          icon="play"
          text={i18n.runPipeline}
          onClick={e => {
            e.stopPropagation()
            runPipeline(pipeline.identifier)
          }}
        />
      </Container>
    </Card>
  )
}
