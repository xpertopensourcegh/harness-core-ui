import React from 'react'
import cx from 'classnames'
import { Card, Text, Tag, Layout, Icon, CardBody, Container, Button, Color } from '@wings-software/uikit'
import { useHistory, Link } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'
import { linkTo } from 'framework/exports'

import { routePipelineCanvas, routeProjectOverview } from 'modules/cd/routes'
import { useDeleteProject } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'
import { Modules } from './Constants'
import i18n from './ProjectCard.i18n'
import css from './ProjectCard.module.scss'

export interface ProjectCardProps {
  data: ProjectDTO
  isPreview?: boolean
  className?: string
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: ProjectDTO) => void
}

interface ContextMenuProps {
  project: ProjectDTO
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: ProjectDTO) => void
}

interface ContinuousDeployementProps {
  data: ProjectDTO
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const { project, reloadProjects, editProject } = props
  const { mutate: deleteProject } = useDeleteProject({ orgIdentifier: project.orgIdentifier || '' })

  const handleDelete = async (): Promise<void> => {
    if (!project?.id) return
    const sure = confirm(`Are you sure you want to delete the project '${project.name}'?`)
    if (!sure) return
    try {
      const deleted = await deleteProject(project.identifier || '', { headers: { 'content-type': 'application/json' } })
      if (!deleted) {
        // TODO: show error
      } else {
        reloadProjects?.()
      }
    } catch (_) {
      // TODO: handle error
    }
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
                linkTo(
                  routePipelineCanvas,
                  {
                    projectIdentifier: data?.identifier,
                    orgIdentifier: data?.orgIdentifier,
                    pipelineIdentifier: -1
                  },
                  true
                )
              )
            }}
          />
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

const ContinuousVerification: React.FC = () => {
  return (
    <Container border={{ top: true, color: Color.GREY_250 }} padding={{ top: 'medium', bottom: 'medium' }}>
      <Layout.Horizontal>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }}>
          <Icon name="nav-cv-hover" size={30} flex={{ align: 'center-center' }} />
        </Container>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
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
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

const GetStarted: React.FC<ContinuousDeployementProps> = props => {
  const { data } = props
  return (
    <Layout.Vertical
      padding={{ top: 'medium', left: 'xlarge', right: 'xlarge', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
      className={css.started}
    >
      <Text font="small" color={Color.BLACK} padding={{ bottom: 'xsmall' }}>
        {i18n.start}
      </Text>
      <Layout.Horizontal spacing="small">
        <Link
          to={linkTo(
            routeProjectOverview,
            {
              projectIdentifier: data?.identifier,
              orgIdentifier: data?.orgIdentifier
            },
            true
          )}
        >
          <Icon name="cd-hover" size={20}></Icon>
        </Link>
        <Icon name="nav-cv-hover" size={20} />
        <Icon name="ce-hover" size={20} />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}
const ProjectCard: React.FC<ProjectCardProps> = props => {
  const { data, isPreview, reloadProjects, editProject } = props

  return (
    <Card className={cx(css.projectCard, props.className)}>
      <Container padding={{ left: 'xlarge', right: 'xlarge', bottom: 'large' }}>
        {!isPreview ? (
          <CardBody.Menu
            menuContent={<ContextMenu project={props.data} reloadProjects={reloadProjects} editProject={editProject} />}
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
        {data?.orgIdentifier ? <Text font={{ size: 'small', weight: 'bold' }}>{data.orgIdentifier}</Text> : null}
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

      {data?.modules?.length ? null : <GetStarted data={data} />}
      {data.modules?.includes(Modules.CD as Required<ProjectDTO>['modules'][number]) ? (
        <ContinuousDeployement data={data} />
      ) : null}
      {data.modules?.includes(Modules.CV as Required<ProjectDTO>['modules'][number]) ? (
        <ContinuousVerification />
      ) : null}
    </Card>
  )
}

export default ProjectCard
