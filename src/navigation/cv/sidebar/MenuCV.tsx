import { Container, Layout, Button, Icon } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams, ModuleName, useStrings } from 'framework/exports'
import { AdminSelector, AdminSelectorLink } from '@common/components/AdminSelector/AdminSelector'
import { ProjectSelector } from '@common/components/ProjectSelector/ProjectSelector'
import {
  routeCVDataSources,
  routeCVActivities,
  routeCVServices,
  routeCVActivityDetails,
  routeCVMainDashBoardPage,
  routeCVAdminGeneralSettings,
  routeCVAdminGovernance,
  routeCVAdminResources,
  routeCVAdminSetup,
  routeCVAdminAccessControl,
  routeCVMetricPackConfigureThresholdPage,
  routeCVAdminActivitySources
} from '../routes'
import css from './MenuCV.module.scss'

const ProjectNavLinks: React.FC = () => {
  const { params } = useRouteParams()
  const { orgIdentifier, projectIdentifier } = (params as unknown) as {
    orgIdentifier: string
    projectIdentifier: string
  }
  const { getString } = useStrings()

  if (!orgIdentifier || !projectIdentifier) {
    return null
  }

  return (
    <>
      <Sidebar.Link
        href={routeCVMainDashBoardPage.url({ projectIdentifier, orgIdentifier })}
        label={getString('cv.navLinks.dashboard')}
        icon="dashboard"
        selected={isRouteActive(routeCVMainDashBoardPage)}
      />
      <Sidebar.Link
        href={routeCVDataSources.url({ projectIdentifier, orgIdentifier })}
        label={getString('cv.navLinks.dataSource')}
        icon="main-help"
        selected={isRouteActive(routeCVDataSources)}
      />
      <Sidebar.Link
        href={routeCVActivities.url({ projectIdentifier, orgIdentifier })}
        label={getString('cv.navLinks.activities')}
        icon="main-depricate"
        selected={isRouteActive(routeCVActivities) || isRouteActive(routeCVActivityDetails)}
      />
      <Sidebar.Link
        href={routeCVServices.url({ projectIdentifier, orgIdentifier })}
        label={getString('cv.navLinks.services')}
        icon="service"
        selected={isRouteActive(routeCVServices)}
      />
      <Sidebar.Link
        href={routeCVMetricPackConfigureThresholdPage.url({ projectIdentifier, orgIdentifier })}
        label={getString('cv.navLinks.metricPacks')}
        icon="wrench"
        selected={isRouteActive(routeCVMetricPackConfigureThresholdPage)}
      />
      <AdminSelector
        selected={
          isRouteActive(routeCVAdminGeneralSettings) ||
          isRouteActive(routeCVAdminGovernance) ||
          isRouteActive(routeCVAdminResources) ||
          isRouteActive(routeCVAdminSetup)
        }
      >
        <AdminSelectorLink
          href={routeCVAdminSetup.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={getString('cv.navLinks.adminSideNavLinks.setup')}
          iconName="resources-icon"
          selected={isRouteActive(routeCVAdminSetup)}
        />
        <AdminSelectorLink
          href={routeCVAdminResources.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={getString('cv.navLinks.adminSideNavLinks.resources')}
          iconName="main-scope"
          selected={isRouteActive(routeCVAdminResources)}
        />
        <AdminSelectorLink
          href={routeCVAdminGovernance.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={getString('cv.navLinks.adminSideNavLinks.governance')}
          iconName="shield"
          selected={isRouteActive(routeCVAdminGovernance)}
        />
        <AdminSelectorLink
          href={routeCVAdminGeneralSettings.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={getString('cv.navLinks.adminSideNavLinks.generalSettings')}
          iconName="settings"
          selected={isRouteActive(routeCVAdminGeneralSettings)}
        />
        <AdminSelectorLink
          href={routeCVAdminAccessControl.url({ projectIdentifier, orgIdentifier })}
          label={getString('cv.navLinks.adminSideNavLinks.accessControl')}
          iconName="user"
          selected={isRouteActive(routeCVAdminAccessControl)}
        />
        <AdminSelectorLink
          href={routeCVAdminActivitySources.url({ projectIdentifier, orgIdentifier })}
          label={getString('cv.navLinks.adminSideNavLinks.activitySources')}
          iconName="user"
          selected={isRouteActive(routeCVAdminActivitySources)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCV: React.FC = () => {
  const history = useHistory()
  const { getString } = useStrings()
  const toggleSummary = useCallback(() => {
    alert('TBD')
  }, [])

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.topBar}>
        <Sidebar.Title upperText={getString('cv.continuous')} lowerText={getString('cv.verification')} />
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
                    orgIdentifier: project.orgIdentifier || ''
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
