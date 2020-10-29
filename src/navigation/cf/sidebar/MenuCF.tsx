import { Container, Layout, Icon, Button } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams, ModuleName } from 'framework/exports'
import { ProjectSelector } from '@common/components/ProjectSelector/ProjectSelector'
// import { AdminSelector, AdminSelectorLink } from '@common/components/AdminSelector/AdminSelector'
import i18n from './MenuCF.i18n'
import {
  routeCFDashboard,
  routeCFFeatureFlags,
  routeCFTargets,
  routeCFWorkflows,
  routeCFFeatureFlagsDetail
  // routeCFAdminBuildSettings,
  // routeCFAdminGovernance,
  // routeCFAdminResources
} from '../routes'
import css from './MenuCF.module.scss'

//
// TODO: icons are not finalized and not available in UIKit
//
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
        href={routeCFDashboard.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.dashboard}
        icon="nav-dashboard"
        selected={isRouteActive(routeCFDashboard)}
      />
      <Sidebar.Link
        href={routeCFFeatureFlags.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.featureFlags}
        icon="flag"
        selected={isRouteActive(routeCFFeatureFlags) || isRouteActive(routeCFFeatureFlagsDetail)}
      />
      <Sidebar.Link
        href={routeCFTargets.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.targets}
        icon="social-media"
        selected={isRouteActive(routeCFTargets)}
      />
      <Sidebar.Link
        href={routeCFWorkflows.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.workflows}
        icon="diagram-tree"
        selected={isRouteActive(routeCFWorkflows)}
      />
      {/* <AdminSelector
        selected={
          isRouteActive(routeCFAdminBuildSettings) ||
          isRouteActive(routeCFAdminGovernance) ||
          isRouteActive(routeCFAdminResources)
        }
      >
        <AdminSelectorLink
          href={routeCFAdminResources.url({ projectIdentifier: project.identifier as string })}
          label={i18n.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCFAdminResources)}
        />
        <AdminSelectorLink
          href={routeCFAdminGovernance.url({ projectIdentifier: project.identifier as string })}
          label={i18n.governance}
          iconName="grid"
          selected={isRouteActive(routeCFAdminGovernance)}
        />
        <AdminSelectorLink
          href={routeCFAdminBuildSettings.url({ projectIdentifier: project.identifier as string })}
          label={i18n.buildSettings}
          iconName="git-repo"
          selected={isRouteActive(routeCFAdminBuildSettings)}
        />
      </AdminSelector> */}
    </>
  )
}

export const MenuCF: React.FC = () => {
  const history = useHistory()
  const toggleSummary = useCallback(() => {
    alert('TBD')
  }, [])

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.topBar}>
        <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.features.toLocaleUpperCase()} />
        <Button noStyling className={css.btnToggleSummary} onClick={toggleSummary}>
          <Icon name="dashboard-selected" size={32} />
        </Button>
      </Container>

      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <>
            <ProjectSelector
              module={ModuleName.CF}
              onSelect={project => {
                history.push(
                  routeCFDashboard.url({
                    orgIdentifier: project.orgIdentifier as string,
                    projectIdentifier: project.identifier as string
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
