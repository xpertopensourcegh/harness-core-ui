import { Container, Layout, Button, Icon } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, routeParams, useAppStoreReader, ModuleName } from 'framework/exports'
import { AdminSelector, AdminSelectorLink } from 'modules/common/components/AdminSelector/AdminSelector'
import { ProjectSelector } from 'modules/common/components/ProjectSelector/ProjectSelector'
import type { ProjectDTO } from 'services/cd-ng'
import i18n from './MenuCV.i18n'
import {
  routeCVDataSources,
  routeCVActivities,
  routeCVServices,
  routeCVActivityDetails,
  routeCVMainDashBoardPage,
  routeCVAdminGeneralSettings,
  routeCVAdminGovernance,
  routeCVAdminResources,
  routeCVAdminAccessControl
} from '../routes'
import css from './MenuCV.module.scss'

const ProjectNavLinks: React.FC<{ project?: ProjectDTO }> = ({ project }) => {
  if (!project) return null

  const { identifier: projectIdentifier, orgIdentifier } = project as Required<ProjectDTO>

  return (
    <>
      <Sidebar.Link
        href={routeCVMainDashBoardPage.url({ projectIdentifier, orgIdentifier })}
        label={i18n.cvSideNavLinks.dashboard}
        icon="main-help"
        selected={isRouteActive(routeCVMainDashBoardPage)}
      />
      <Sidebar.Link
        href={routeCVDataSources.url({ projectIdentifier, orgId: orgIdentifier })}
        label={i18n.cvSideNavLinks.dataSource}
        icon="main-help"
        selected={isRouteActive(routeCVDataSources)}
      />
      <Sidebar.Link
        href={routeCVActivities.url({ projectIdentifier, orgIdentifier })}
        label={i18n.cvSideNavLinks.activites}
        icon="main-depricate"
        selected={isRouteActive(routeCVActivities) || isRouteActive(routeCVActivityDetails)}
      />
      <Sidebar.Link
        href={routeCVServices.url({ projectIdentifier, orgIdentifier })}
        label={i18n.cvSideNavLinks.services}
        icon="service"
        selected={isRouteActive(routeCVServices)}
      />
      <AdminSelector
        selected={
          isRouteActive(routeCVAdminGeneralSettings) ||
          isRouteActive(routeCVAdminGovernance) ||
          isRouteActive(routeCVAdminResources)
        }
      >
        <AdminSelectorLink
          href={routeCVAdminResources.url({
            projectIdentifier: project.identifier as string,
            orgIdentifier: project.orgIdentifier as string
          })}
          label={i18n.adminSideNavLinks.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCVAdminResources)}
        />
        <AdminSelectorLink
          href={routeCVAdminGovernance.url({
            projectIdentifier: project.identifier as string,
            orgIdentifier: project.orgIdentifier as string
          })}
          label={i18n.adminSideNavLinks.governance}
          iconName="shield"
          selected={isRouteActive(routeCVAdminGovernance)}
        />
        <AdminSelectorLink
          href={routeCVAdminGeneralSettings.url({
            projectIdentifier: project.identifier as string,
            orgIdentifier: project.orgIdentifier as string
          })}
          label={i18n.adminSideNavLinks.generalSettings}
          iconName="settings"
          selected={isRouteActive(routeCVAdminGeneralSettings)}
        />
        <AdminSelectorLink
          href={routeCVAdminAccessControl.url({ projectIdentifier: project.identifier as string, orgIdentifier })}
          label={i18n.adminSideNavLinks.accessControl}
          iconName="user"
          selected={isRouteActive(routeCVAdminAccessControl)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCV: React.FC = () => {
  const {
    params: { projectIdentifier }
  } = routeParams()
  const history = useHistory()
  const { projects } = useAppStoreReader()
  const selectedProjectDTO = projects?.find(p => p.identifier === projectIdentifier)
  const toggleSummary = useCallback(() => {
    alert('TBD')
  }, [])

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.topBar}>
        <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.verification.toLocaleUpperCase()} />
        <Button noStyling className={css.btnToggleSummary} onClick={toggleSummary}>
          <Icon name="dashboard-selected" size={32} />
        </Button>
      </Container>

      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <>
            <ProjectSelector
              module={ModuleName.CV}
              onSelect={project => {
                history.push(
                  routeCVMainDashBoardPage.url({
                    projectIdentifier: project.identifier as string,
                    orgIdentifier: project.orgIdentifier as string
                  })
                )
              }}
            />
            <ProjectNavLinks project={selectedProjectDTO} />
          </>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
