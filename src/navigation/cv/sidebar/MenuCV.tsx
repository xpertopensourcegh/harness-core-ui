import { Container, Layout, Button, Icon } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams, ModuleName } from 'framework/exports'
import { AdminSelector, AdminSelectorLink } from '@common/components/AdminSelector/AdminSelector'
import { ProjectSelector } from '@common/components/ProjectSelector/ProjectSelector'
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
  routeCVAdminAccessControl,
  routeCVMetricPackConfigureThresholdPage
} from '../routes'
import css from './MenuCV.module.scss'

const ProjectNavLinks: React.FC = () => {
  const { params } = useRouteParams()
  const { orgIdentifier, projectIdentifier } = (params as unknown) as {
    orgIdentifier: string
    projectIdentifier: string
  }

  if (!orgIdentifier || !projectIdentifier) {
    return null
  }

  return (
    <>
      <Sidebar.Link
        href={routeCVMainDashBoardPage.url({ projectIdentifier, orgIdentifier })}
        label={i18n.cvSideNavLinks.dashboard}
        icon="dashboard"
        selected={isRouteActive(routeCVMainDashBoardPage)}
      />
      <Sidebar.Link
        href={routeCVDataSources.url({ projectIdentifier, orgIdentifier })}
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
      <Sidebar.Link
        href={routeCVMetricPackConfigureThresholdPage.url({ projectIdentifier, orgIdentifier })}
        label={i18n.cvSideNavLinks.metricPacks}
        icon="wrench"
        selected={isRouteActive(routeCVMetricPackConfigureThresholdPage)}
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
            projectIdentifier,
            orgIdentifier
          })}
          label={i18n.adminSideNavLinks.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCVAdminResources)}
        />
        <AdminSelectorLink
          href={routeCVAdminGovernance.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={i18n.adminSideNavLinks.governance}
          iconName="shield"
          selected={isRouteActive(routeCVAdminGovernance)}
        />
        <AdminSelectorLink
          href={routeCVAdminGeneralSettings.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={i18n.adminSideNavLinks.generalSettings}
          iconName="settings"
          selected={isRouteActive(routeCVAdminGeneralSettings)}
        />
        <AdminSelectorLink
          href={routeCVAdminAccessControl.url({ projectIdentifier, orgIdentifier })}
          label={i18n.adminSideNavLinks.accessControl}
          iconName="user"
          selected={isRouteActive(routeCVAdminAccessControl)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCV: React.FC = () => {
  const history = useHistory()
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
                    projectIdentifier: project.identifier,
                    orgIdentifier: project.orgIdentifier
                  })
                )
              }}
            />
            <ProjectNavLinks />
          </>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
