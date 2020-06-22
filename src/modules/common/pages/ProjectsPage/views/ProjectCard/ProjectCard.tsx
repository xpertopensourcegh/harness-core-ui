import React from 'react'
import cx from 'classnames'
import { Card, Text, Tag, Layout, Icon, CardBody, Container, Button, Color } from '@wings-software/uikit'
import { linkTo } from 'framework/exports'
import { useHistory } from 'react-router-dom'
import { Menu } from '@blueprintjs/core'

import { routePipelineCanvas } from 'modules/cd/routes'
import css from './ProjectCard.module.scss'
import i18n from './ProjectCard.i18n'
import { useDeleteProject } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

export interface ProjectCardProps {
  data?: ProjectDTO
  isPreview?: boolean
  className?: string
  reloadProjects?: () => Promise<unknown>
}

interface ContextMenuProps {
  project?: ProjectDTO
  reloadProjects?: () => Promise<unknown>
}

const ContextMenu: React.FC<ContextMenuProps> = ({ project, reloadProjects }) => {
  const { mutate: deleteProject } = useDeleteProject({})

  return (
    <Menu>
      <Menu.Item icon="edit" text="Edit" />
      <Menu.Item
        icon="trash"
        text="Delete"
        onClick={async () => {
          if (!project?.id) return
          try {
            const deleted = await deleteProject(project.id, { headers: { 'content-type': 'application/json' } })
            if (!deleted) {
              // TODO: show error
            } else {
              reloadProjects?.()
            }
          } catch (_) {
            // TODO: handle error
          }
        }}
      />
    </Menu>
  )
}

const ProjectCard: React.FC<ProjectCardProps> = props => {
  const history = useHistory()
  const { data, isPreview, reloadProjects } = props

  return (
    <Card className={cx(css.projectCard, props.className)}>
      {!isPreview ? (
        <CardBody.Menu menuContent={<ContextMenu project={props.data} reloadProjects={reloadProjects} />} />
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
