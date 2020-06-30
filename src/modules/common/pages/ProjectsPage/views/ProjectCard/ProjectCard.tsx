import React from 'react'
import cx from 'classnames'
import { Card, Text, Tag, Layout, Icon, CardBody, Container, Button, Color } from '@wings-software/uikit'
import { linkTo } from 'framework/exports'
import { useHistory } from 'react-router-dom'
import { Menu, Classes } from '@blueprintjs/core'

import { routePipelineCanvas } from 'modules/cd/routes'
import css from './ProjectCard.module.scss'
import i18n from './ProjectCard.i18n'
import { useDeleteProject } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

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
      <Menu.Item icon="edit" onClick={handleEdit} />
      <Menu.Item icon="trash" onClick={handleDelete} />
    </Menu>
  )
}

const ProjectCard: React.FC<ProjectCardProps> = props => {
  const { data, isPreview, reloadProjects, editProject } = props
  const history = useHistory()

  return (
    <Card className={cx(css.projectCard, props.className)}>
      {!isPreview ? (
        <CardBody.Menu
          menuContent={<ContextMenu project={props.data} reloadProjects={reloadProjects} editProject={editProject} />}
          menuPopoverProps={{
            className: Classes.DARK
          }}
        />
      ) : null}
      <div className={css.colorBar} style={{ backgroundColor: data?.color || 'var(--green-500)' }}></div>
      <Text font="medium" color={Color.BLACK}>
        {data?.name || 'Project Name'}
      </Text>
      {data?.description ? (
        <Text font="small" padding={{ top: 'xsmall' }}>
          {data.description}
        </Text>
      ) : isPreview ? (
        <Text font="small" padding={{ top: 'xsmall' }}>
          {i18n.sampleDescription}
        </Text>
      ) : null}
      {(data?.tags && data.tags.length > 0) || isPreview ? (
        <Layout.Horizontal spacing="small" padding={{ top: 'medium' }}>
          {data?.tags && data.tags.length > 0 ? (
            data?.tags.map((tag: string) => (
              <Tag minimal key={tag}>
                {tag}
              </Tag>
            ))
          ) : isPreview ? (
            <>
              <Tag minimal>sample</Tag>
              <Tag minimal>tags</Tag>
            </>
          ) : null}
        </Layout.Horizontal>
      ) : null}
      <Container
        margin={{ top: 'medium', bottom: 'large' }}
        padding={{ top: 'medium', bottom: 'large' }}
        border={{ top: true, bottom: true, color: Color.GREY_250 }}
      >
        <Button
          intent="primary"
          text="Create Pipeline"
          disabled={isPreview}
          onClick={() => {
            history.push(linkTo(routePipelineCanvas, { projectId: data?.id, pipelineId: -1 }))
          }}
        />
      </Container>
      <Icon name="main-user" />
    </Card>
  )
}

export default ProjectCard
