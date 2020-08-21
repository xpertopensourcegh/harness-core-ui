import React from 'react'
import cx from 'classnames'
import { Card, Text, Tag, Layout, Icon, CardBody, Container, Button, Color } from '@wings-software/uikit'
import { useHistory, Link } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'
import { routeCVDataSources } from 'modules/cv/routes'

import { routeCDPipelineStudio, routeCDDashboard } from 'modules/cd/routes'
import { useDeleteProject } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import { useConfirmationDialog } from 'modules/common/modals/ConfirmDialog/useConfirmationDialog'
import { Modules } from './Constants'
import i18n from './ProjectCard.i18n'
import css from './ProjectCard.module.scss'

export interface ProjectCardProps {
  data: ProjectDTO
  isPreview?: boolean
  className?: string
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: ProjectDTO) => void
  onDeleted?: (project: ProjectDTO) => void
}

interface ContextMenuProps {
  project: ProjectDTO
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: ProjectDTO) => void
  onDeleted?: (project: ProjectDTO) => void
}

interface ContinuousDeployementProps {
  data: ProjectDTO
  isPreview?: boolean
}

interface ContinuousVerificationProps {
  data: ProjectDTO
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const { project, reloadProjects, editProject, onDeleted } = props
  const { mutate: deleteProject } = useDeleteProject({ orgIdentifier: project.orgIdentifier || '' })
  const { showSuccess, showError } = useToaster()

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(project.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteProject(project.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted) showSuccess(`Project ${project.name} deleted`)
          onDeleted?.(project)
          reloadProjects?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

  const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    if (!project?.id) return
    openDialog()
  }

  const handleEdit = (): void => {
    if (!project) return
    editProject?.(project)
  }

  return (
    <Menu style={{ minWidth: 'unset' }}>
      <Menu.Item icon="edit" text="Edit" onClick={handleEdit} />
      <Menu.Item icon="new-person" text="Invite Collaborators" />
      <Menu.Divider />
      <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
    </Menu>
  )
}

const ContinuousDeployement: React.FC<ContinuousDeployementProps> = props => {
  const { data } = props
  const history = useHistory()

  return (
    <Container border={{ top: true, color: Color.GREY_250 }} padding={{ top: 'medium', bottom: 'medium' }}>
      <Layout.Horizontal>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }}>
          <Icon name="cd-hover" size={30} flex={{ align: 'center-center' }} />
        </Container>
        <Container width="66.66%" padding={{ left: 'xlarge' }}>
          <Button
            intent="primary"
            text={i18n.createPipeline}
            onClick={() => {
              history.push(
                routeCDPipelineStudio.url({
                  projectIdentifier: data?.identifier as string,
                  orgIdentifier: data?.orgIdentifier as string,
                  pipelineIdentifier: -1
                })
              )
            }}
          />
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

const ContinuousVerification: React.FC<ContinuousVerificationProps> = props => {
  const { data: { identifier, orgIdentifier } = { identifier: '', orgIdentifier: '' } } = props || { data: {} }
  const history = useHistory()
  return (
    <Container border={{ top: true, color: Color.GREY_250 }} padding={{ top: 'medium', bottom: 'medium' }}>
      <Layout.Horizontal>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }}>
          <Icon name="nav-cv-hover" size={30} flex={{ align: 'center-center' }} />
        </Container>
        <Container width="66.66%">
          <Button
            intent="primary"
            text={i18n.createDataSource}
            onClick={() => {
              history.push({
                pathname: routeCVDataSources.url({ projectIdentifier: identifier || '', orgId: orgIdentifier || '' }),
                state: {
                  projectId: identifier,
                  orgId: orgIdentifier
                },
                search: `?onBoarding=true`
              })
            }}
          />
        </Container>
        {/* <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" flex={{ align: 'center-center' }}>
              {i18n.number}
            </Text>
            <Text font="small">{i18n.activities}</Text>
          </Layout.Vertical>
        </Container>

        <Container width="33.33%" flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" flex={{ align: 'center-center' }}>
              {i18n.number}
            </Text>
            <Text font="small">{i18n.alerts}</Text>
          </Layout.Vertical>
        </Container> */}
      </Layout.Horizontal>
    </Container>
  )
}

const GetStarted: React.FC<ContinuousDeployementProps> = props => {
  const { data, isPreview } = props
  return (
    <Layout.Vertical
      padding={{ top: 'medium', left: 'xlarge', right: 'xlarge', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
      className={css.started}
    >
      <Text font="small" color={Color.BLACK} padding={{ bottom: 'xsmall' }}>
        {i18n.start}
      </Text>
      {isPreview ? (
        <Layout.Horizontal spacing="small">
          <Icon name="cd-hover" size={20} />
          <Icon name="nav-cv-hover" size={20} />
          <Icon name="ce-hover" size={20} />
        </Layout.Horizontal>
      ) : (
        <Layout.Horizontal spacing="small">
          <Link
            to={routeCDDashboard.url({
              projectIdentifier: data?.identifier as string
            })}
          >
            <Icon name="cd-hover" size={20} />
          </Link>
          <Icon name="nav-cv-hover" size={20} />
          <Icon name="ce-hover" size={20} />
        </Layout.Horizontal>
      )}
    </Layout.Vertical>
  )
}
const ProjectCard: React.FC<ProjectCardProps> = props => {
  const { data, isPreview, reloadProjects, editProject, onDeleted } = props

  return (
    <Card className={cx(css.projectCard, props.className)}>
      <Container padding={{ left: 'xlarge', right: 'xlarge', bottom: 'large' }}>
        {!isPreview ? (
          <CardBody.Menu
            menuContent={
              <ContextMenu
                project={props.data}
                reloadProjects={reloadProjects}
                editProject={editProject}
                onDeleted={onDeleted}
              />
            }
            menuPopoverProps={{
              className: Classes.DARK
            }}
          />
        ) : null}
        <div className={css.colorBar} style={{ backgroundColor: data?.color || 'var(--green-500)' }}></div>
        {data?.name ? (
          <Text font="medium" color={Color.BLACK}>
            {data.name}
          </Text>
        ) : isPreview ? (
          <Text font="medium" color={Color.BLACK}>
            {i18n.projectName}
          </Text>
        ) : null}
        {data?.organizationName ? <Text font={{ size: 'small', weight: 'bold' }}>{data.organizationName}</Text> : null}
        {data?.description ? (
          <Text font="small" padding={{ top: 'medium' }}>
            {data.description}
          </Text>
        ) : null}
        {data?.tags?.length ? (
          <Layout.Horizontal spacing="xsmall" padding={{ top: 'small' }}>
            {data.tags.map((tag: string) => (
              <Tag className={css.cardTags} key={tag}>
                {tag}
              </Tag>
            ))}
          </Layout.Horizontal>
        ) : null}
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

      {data?.modules?.length ? null : <GetStarted data={data} isPreview={isPreview} />}
      {data.modules?.includes(Modules.CD as Required<ProjectDTO>['modules'][number]) ? (
        <ContinuousDeployement data={data} />
      ) : null}
      {data.modules?.includes(Modules.CV as Required<ProjectDTO>['modules'][number]) ? (
        <ContinuousVerification data={data} />
      ) : null}
    </Card>
  )
}

export default ProjectCard
