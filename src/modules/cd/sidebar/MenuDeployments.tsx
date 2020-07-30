import { Container, Layout, Select, SelectOption, Icon, Button } from '@wings-software/uikit'
import React from 'react'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import { useHistory } from 'react-router-dom'
import { linkTo, Sidebar, isRouteActive, routeParams } from 'framework/exports'
import { useGetProjectListBasedOnFilter } from 'services/cd-ng'
import { useProjectModal } from 'modules/common/exports'
import i18n from './MenuDeployments.i18n'
import { routeResources } from '../../common/routes'
import { routePipelines, routeProjectOverview, routeDeployments, routeCDProjects } from '../routes'
import css from './MenuDeployments.module.scss'

interface ProjectListOptions extends SelectOption {
  orgId?: string
}

export const MenuDeployments: React.FC = () => {
  const {
    params: { accountId, projectIdentifier }
  } = routeParams()
  const { data, loading } = useGetProjectListBasedOnFilter({ queryParams: { accountIdentifier: accountId } })
  const history = useHistory()
  const isProjectsPage = history.location.pathname.endsWith('/cd-projects')
  const [selectedProject, setProject] = React.useState<ProjectListOptions | undefined>()

  const projectCreateSuccessHandler = (): void => {
    closeProjectModal()
    history.go(0)
  }

  const { openProjectModal, closeProjectModal } = useProjectModal({ onSuccess: projectCreateSuccessHandler })

  const projects = React.useMemo(
    () => [
      ...(data?.data?.content?.map(project => {
        return {
          label: project.name || '',
          value: project.identifier || '',
          orgId: project.orgIdentifier || '',
          icon: { name: 'nav-project-hover' } as IconProps
        }
      }) || [])
    ],
    [data?.data?.content?.map]
  )

  React.useEffect(() => {
    if (!loading && projectIdentifier) {
      setProject(projects.filter(project => project.value === projectIdentifier)[0])
    }
  }, [loading, projects, projectIdentifier])

  return (
    <Layout.Vertical spacing="medium">
      <div className={css.topBar}>
        <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.deployments} />
        <Icon
          className={css.dashboardLink}
          name="dashboard-selected"
          size={32}
          onClick={() => history.push(linkTo(routeCDProjects, {}, true))}
        />
      </div>
      {isProjectsPage ? (
        <Button text={i18n.addProject} minimal intent="primary" onClick={() => openProjectModal()} />
      ) : (
        <Container style={{ marginTop: '25px' }}>
          <Layout.Vertical>
            {!loading && selectedProject ? (
              <>
                <Select
                  className={css.projectSelect}
                  items={projects}
                  value={selectedProject}
                  onChange={item => setProject(item)}
                />
                <Sidebar.Link
                  href={linkTo(routeProjectOverview, {
                    projectIdentifier: selectedProject.value as string,
                    orgIdentifier: selectedProject.orgId as string
                  })}
                  label={i18n.overview}
                  icon="globe-network"
                  selected={isRouteActive(routeProjectOverview)}
                />
                <Sidebar.Link
                  href={linkTo(routeDeployments, {
                    projectIdentifier: selectedProject.value as string,
                    orgIdentifier: selectedProject.orgId as string
                  })}
                  label={i18n.deployments}
                  icon="list-detail-view"
                  selected={isRouteActive(routeDeployments)}
                />
                <Sidebar.Link
                  href={linkTo(routePipelines, {
                    projectIdentifier: selectedProject.value as string,
                    orgIdentifier: selectedProject.orgId as string
                  })}
                  label={i18n.pipelines}
                  icon="nav-pipelines"
                  selected={isRouteActive(routePipelines)}
                />
              </>
            ) : (
              <div>{i18n.loading}</div>
            )}
            <hr />
            <Sidebar.Link
              href={linkTo(routeResources)}
              label={i18n.resources}
              icon="nav-resources"
              selected={isRouteActive(routeResources)}
            />
          </Layout.Vertical>
        </Container>
      )}
    </Layout.Vertical>
  )
}
