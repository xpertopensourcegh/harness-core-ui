import React, { useState } from 'react'
import { Button, Color, Container, Icon, Layout, Popover, Tag, Text } from '@wings-software/uikit'
import { Link, useParams } from 'react-router-dom'
import { Card, Classes, Position } from '@blueprintjs/core'
import { Page } from '@common/exports'
import { routeProjects } from 'navigation/projects/routes'
import { Project, useGetProject } from 'services/cd-ng'
import type { ModuleName } from 'framework/exports'
import ModuleListCard from '@projects-orgs/components/ModuleListCard/ModuleListCard'
import ModuleEnableCard from '@projects-orgs/components/ModuleEnableCard/ModuleEnableCard'
import { getEnableModules } from '@projects-orgs/utils/utils'
import { useProjectModal } from '@projects-orgs/modals/ProjectModal/useProjectModal'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import ContextMenu from '@projects-orgs/components/Menu/ContextMenu'
import ActivityStack from '@common/components/ActivityStack/ActivityStack'
import i18n from './ProjectDetails.i18n'
import { activityData } from './ActivityMock'
import css from './ProjectDetails.module.scss'

const ProjectDetails: React.FC = () => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)

  const { data, refetch } = useGetProject({
    identifier: projectIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgIdentifier
    }
  })
  const projectCreateSuccessHandler = (): void => {
    refetch()
  }

  const { openProjectModal } = useProjectModal({
    onSuccess: projectCreateSuccessHandler
  })

  const showEditProject = (project: Project): void => {
    openProjectModal(project)
  }

  const { openCollaboratorModal } = useCollaboratorModal()

  const showCollaborators = (project: Project): void => {
    openCollaboratorModal(project)
  }

  return (
    <>
      <Page.Header
        size="xlarge"
        title={
          <Layout.Vertical spacing="small" padding="medium" className={css.title}>
            <Layout.Horizontal>
              <Link to={routeProjects.url()}>
                <Text font="small" color={Color.BLUE_600}>
                  {i18n.manage}
                </Text>
              </Link>
            </Layout.Horizontal>
            <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK} lineClamp={1}>
              {data?.data?.name}
            </Text>
            <Text font="small" lineClamp={2}>
              {data?.data?.description}
            </Text>
            {data?.data?.tags?.length ? (
              <Layout.Horizontal padding={{ top: 'small' }} className={css.wrap}>
                {data.data.tags.map((tag: string) => (
                  <Tag className={css.cardTags} key={tag}>
                    {tag}
                  </Tag>
                ))}
              </Layout.Horizontal>
            ) : null}
          </Layout.Vertical>
        }
        toolbar={
          <Layout.Horizontal padding="xxlarge">
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall">
              <Icon name="main-user-groups" size={20} />
              <Text font="xsmall">{i18n.admin.toUpperCase()}</Text>
            </Layout.Vertical>
            <Layout.Vertical padding={{ right: 'large' }} spacing="xsmall">
              <Icon name="main-user-groups" size={20} />
              <Text font="xsmall">{i18n.collaborators.toUpperCase()}</Text>
            </Layout.Vertical>
            <Popover
              isOpen={menuOpen}
              onInteraction={nextOpenState => {
                setMenuOpen(nextOpenState)
              }}
              className={Classes.DARK}
              position={Position.BOTTOM_RIGHT}
            >
              <Button
                minimal
                icon="more"
                onClick={e => {
                  e.stopPropagation()
                  setMenuOpen(true)
                }}
              />
              <ContextMenu
                project={data?.data as Project}
                reloadProjects={refetch}
                editProject={showEditProject}
                collaborators={showCollaborators}
                setMenuOpen={setMenuOpen}
              />
            </Popover>
          </Layout.Horizontal>
        }
        className={css.header}
      />
      <Page.Body filled className={css.pageHeight}>
        <Layout.Horizontal>
          <div>
            <Container padding="xxlarge" className={css.enabledModules}>
              {data?.data?.modules?.length ? (
                <Layout.Vertical padding="small" spacing="large">
                  <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
                    {i18n.modulesEnabled}
                  </Text>
                  {data.data.modules.map(module => (
                    <ModuleListCard
                      module={module as ModuleName}
                      key={module}
                      projectIdentifier={data.data?.identifier || ''}
                      orgIdentifier={data.data?.identifier || ''}
                    />
                  ))}
                </Layout.Vertical>
              ) : (
                <Layout.Vertical padding="small" spacing="large">
                  <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
                    {i18n.modulesEnabled}
                  </Text>
                  <Layout.Vertical padding="huge" flex={{ align: 'center-center' }} spacing="huge">
                    <Icon name="nav-project" size={70} />
                    <Text font="medium">{i18n.noModules}</Text>
                  </Layout.Vertical>
                </Layout.Vertical>
              )}
            </Container>
            <Container padding="xxlarge">
              {data?.data?.modules?.length === 5 ? null : (
                <>
                  <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
                    {i18n.enableModules}
                  </Text>
                  <Layout.Horizontal spacing="small" padding={{ top: 'large' }}>
                    {getEnableModules(data?.data?.modules || []).map(module => (
                      <ModuleEnableCard key={module} data={data?.data as Project} module={module as ModuleName} />
                    ))}
                  </Layout.Horizontal>
                </>
              )}
            </Container>
          </div>
          <Layout.Vertical padding="huge" spacing="large">
            <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK}>
              {i18n.recentActivities}
            </Text>
            <Card className={css.activityCard}>
              <ActivityStack
                items={activityData}
                tooltip={item => (
                  <Layout.Vertical padding="medium">
                    <Text>{item.activity}</Text>
                    <Text>{item.updatedBy}</Text>
                  </Layout.Vertical>
                )}
              ></ActivityStack>
            </Card>
          </Layout.Vertical>
        </Layout.Horizontal>
      </Page.Body>
    </>
  )
}

export default ProjectDetails
