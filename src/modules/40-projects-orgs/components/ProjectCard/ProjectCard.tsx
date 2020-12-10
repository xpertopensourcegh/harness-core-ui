import React from 'react'
import cx from 'classnames'
import { Card, Text, Layout, CardBody, Container, Color, AvatarGroup } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'
import { ModuleName, useAppStore } from 'framework/exports'
import type { Project, ProjectAggregateDTO } from 'services/cd-ng'
import DefaultRenderer from '@projects-orgs/components/ModuleRenderer/DefaultRenderer'
import CVRenderer from '@projects-orgs/components/ModuleRenderer/cv/CVRenderer'
import CIRenderer from '@projects-orgs/components/ModuleRenderer/ci/CIRenderer'
import CDRenderer from '@projects-orgs/components/ModuleRenderer/cd/CDRenderer'
import ContextMenu from '@projects-orgs/components/Menu/ContextMenu'
import routes from '@common/RouteDefinitions'
import CERenderer from '@projects-orgs/components/ModuleRenderer/ce/CERenderer'
import CFRenderer from '@projects-orgs/components/ModuleRenderer/cf/CFRenderer'
import useDeleteProjectDialog from '@projects-orgs/pages/projects/DeleteProject'
import TagsRenderer from '@common/components/TagsRenderer/TagsRenderer'
import i18n from './ProjectCard.i18n'
import css from './ProjectCard.module.scss'

export interface ProjectCardProps {
  data: ProjectAggregateDTO
  isPreview?: boolean
  className?: string
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: Project) => void
  handleInviteCollaborators?: (project: Project) => void
}

const ProjectCard: React.FC<ProjectCardProps> = props => {
  const { data: projectAggregateDTO, isPreview, reloadProjects, editProject, handleInviteCollaborators } = props
  const { projectResponse, organization, admins: adminList, collaborators: collaboratorsList } = projectAggregateDTO
  const data = projectResponse.project || null
  const { projects, updateAppStore } = useAppStore()
  const history = useHistory()
  const onDeleted = (): void => {
    const index = projects.findIndex(p => p.identifier === data.identifier)
    projects.splice(index, 1)
    updateAppStore({ projects: ([] as Project[]).concat(projects) })
    reloadProjects?.()
  }
  const openDialog = useDeleteProjectDialog(data, onDeleted)

  return (
    <Card className={cx(css.projectCard, props.className)}>
      <Container padding="xlarge" className={css.projectInfo}>
        {!isPreview ? (
          <CardBody.Menu
            menuContent={
              <ContextMenu
                project={data}
                reloadProjects={reloadProjects}
                editProject={editProject}
                collaborators={handleInviteCollaborators}
                openDialog={openDialog}
              />
            }
            menuPopoverProps={{
              className: Classes.DARK
            }}
          />
        ) : null}
        <Container
          onClick={() => {
            history.push(
              routes.toProjectDetails({
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier || '',
                accountId: data.accountIdentifier || ''
              })
            )
          }}
        >
          <div className={css.colorBar} style={{ backgroundColor: data.color }} />
          {data.name ? (
            <Text font="medium" lineClamp={1} color={Color.BLACK}>
              {data.name}
            </Text>
          ) : isPreview ? (
            <Text font="medium" lineClamp={1} color={Color.BLACK}>
              {i18n.projectName}
            </Text>
          ) : null}
          <Text font={{ size: 'small', weight: 'bold' }}>{organization?.name}</Text>
          {data.description ? (
            <Text font="small" lineClamp={2} padding={{ top: 'medium' }}>
              {data.description}
            </Text>
          ) : null}
          {data.tags && (
            <Container padding={{ top: 'medium' }}>
              <TagsRenderer tags={data.tags} length={3} />
            </Container>
          )}

          <Layout.Horizontal padding={{ top: 'medium' }}>
            <Layout.Vertical padding={{ right: 'large' }} spacing="small">
              <AvatarGroup
                className={css.projectAvatarGroup}
                avatars={adminList?.length ? adminList : [{}]}
                onAdd={event => {
                  event.stopPropagation()
                  handleInviteCollaborators ? handleInviteCollaborators(data) : null
                }}
              />
              <Text padding={{ left: 'xsmall' }} font="xsmall">{`${i18n.admin} ${
                adminList?.length ? `(${adminList?.length})` : ``
              }`}</Text>
            </Layout.Vertical>
            <Layout.Vertical spacing="small">
              <AvatarGroup
                className={css.projectAvatarGroup}
                avatars={collaboratorsList?.length ? collaboratorsList : [{}]}
                onAdd={event => {
                  event.stopPropagation()

                  handleInviteCollaborators ? handleInviteCollaborators(data) : null
                }}
              />
              <Text padding={{ left: 'xsmall' }} font="xsmall">{`${i18n.collaborators} ${
                collaboratorsList?.length ? `(${collaboratorsList?.length})` : ``
              }`}</Text>
            </Layout.Vertical>
          </Layout.Horizontal>
        </Container>
      </Container>
      {!data.modules?.length ? <DefaultRenderer /> : null}
      {data.modules?.includes(ModuleName.CD) ? <CDRenderer data={data} isPreview={isPreview} /> : null}
      {data.modules?.includes(ModuleName.CV) ? <CVRenderer data={data} isPreview={isPreview} /> : null}
      {data.modules?.includes(ModuleName.CI) ? <CIRenderer data={data} isPreview={isPreview} /> : null}
      {data.modules?.includes(ModuleName.CF) ? <CFRenderer data={data} isPreview={isPreview} /> : null}
      {data.modules?.includes(ModuleName.CE) ? <CERenderer data={data} isPreview={isPreview} /> : null}
    </Card>
  )
}

export default ProjectCard
