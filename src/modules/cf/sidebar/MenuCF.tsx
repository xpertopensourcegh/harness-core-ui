import { Container, Layout, Icon, Button } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, routeParams, useAppStoreReader, ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { ProjectSelector } from 'modules/common/components/ProjectSelector/ProjectSelector'
// import { AdminSelector, AdminSelectorLink } from 'modules/common/components/AdminSelector/AdminSelector'
import i18n from './MenuCF.i18n'
import {
  routeCFDashboard,
  routeCFFeatureFlags,
  routeCFTargets,
  routeCFWorkflows
  // routeCFAdminBuildSettings,
  // routeCFAdminGovernance,
  // routeCFAdminResources
} from '../routes'
import css from './MenuCF.module.scss'

//
// TODO: icons are not finalized and not available in UIKit
//
const ProjectNavLinks: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) return null

  const { identifier: projectIdentifier } = project as Required<Project>

  return (
    <>
      <Sidebar.Link
        href={routeCFDashboard.url({
          projectIdentifier
        })}
        label={i18n.dashboard}
        icon="nav-dashboard"
        selected={isRouteActive(routeCFDashboard)}
      />
      <Sidebar.Link
        href={routeCFFeatureFlags.url({
          projectIdentifier
        })}
        label={i18n.featureFlags}
        icon="flag"
        selected={isRouteActive(routeCFFeatureFlags)}
      />
      <Sidebar.Link
        href={routeCFTargets.url({
          projectIdentifier
        })}
        label={i18n.targets}
        icon="social-media"
        selected={isRouteActive(routeCFTargets)}
      />
      <Sidebar.Link
        href={routeCFWorkflows.url({
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
                history.push(routeCFDashboard.url({ projectIdentifier: project.identifier as string }))
              }}
            />
            <ProjectNavLinks project={selectedProjectDTO} />
          </>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
