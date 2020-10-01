import { Container, Layout, Icon, Button } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams, ModuleName } from 'framework/exports'
import { ProjectSelector } from 'modules/common/components/ProjectSelector/ProjectSelector'
import { AdminSelector, AdminSelectorLink } from 'modules/common/components/AdminSelector/AdminSelector'
import i18n from './MenuCD.i18n'
import {
  routeCDPipelines,
  routeCDDeployments,
  routeCDDashboard,
  routeCDAccessControl,
  routeCDResources,
  routeCDTemplateLibrary,
  routeCDGitSync,
  routeCDGovernance,
  routeCDGeneralSettings,
  routePipelineDetail,
  routeInputSetList,
  routePipelineDeploymentList
} from '../routes'
import css from './MenuCD.module.scss'

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
        href={routeCDDashboard.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.dashboard}
        icon="globe-network"
        selected={isRouteActive(routeCDDashboard)}
      />
      <Sidebar.Link
        href={routeCDDeployments.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.deployments}
        icon="list-detail-view"
        selected={isRouteActive(routeCDDeployments)}
      />
      <Sidebar.Link
        href={routeCDPipelines.url({
          projectIdentifier,
          orgIdentifier
        })}
        label={i18n.pipelines}
        icon="nav-pipelines"
        selected={
          isRouteActive(routeCDPipelines) ||
          isRouteActive(routePipelineDetail) ||
          isRouteActive(routeInputSetList) ||
          isRouteActive(routePipelineDeploymentList)
        }
      />
      <AdminSelector
        selected={
          isRouteActive(routeCDResources) ||
          isRouteActive(routeCDTemplateLibrary) ||
          isRouteActive(routeCDGitSync) ||
          isRouteActive(routeCDGovernance) ||
          isRouteActive(routeCDAccessControl) ||
          isRouteActive(routeCDGeneralSettings)
        }
      >
        <AdminSelectorLink
          href={routeCDResources.url({
            projectIdentifier,
            orgIdentifier
          })}
          label={i18n.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCDResources)}
        />
        <AdminSelectorLink
          href={routeCDTemplateLibrary.url({ orgIdentifier, projectIdentifier })}
          label={i18n.templateLibrary}
          iconName="grid"
          selected={isRouteActive(routeCDTemplateLibrary)}
        />
        <AdminSelectorLink
          href={routeCDGitSync.url({ orgIdentifier, projectIdentifier })}
          label={i18n.gitSync}
          iconName="git-repo"
          selected={isRouteActive(routeCDGitSync)}
        />
        <AdminSelectorLink
          href={routeCDGovernance.url({ orgIdentifier, projectIdentifier })}
          label={i18n.governance}
          iconName="shield"
          selected={isRouteActive(routeCDGovernance)}
        />
        <AdminSelectorLink
          href={routeCDAccessControl.url({ orgIdentifier, projectIdentifier })}
          label={i18n.accessControl}
          iconName="user"
          selected={isRouteActive(routeCDAccessControl)}
        />
        <AdminSelectorLink
          href={routeCDGeneralSettings.url({ orgIdentifier, projectIdentifier })}
          label={i18n.generalSettings}
          iconName="settings"
          selected={isRouteActive(routeCDGeneralSettings)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCD: React.FC = () => {
  const history = useHistory()
  const toggleSummary = useCallback(() => {
    alert('TBD')
  }, [])

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.topBar}>
        <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.deployments.toLocaleUpperCase()} />
        <Button noStyling className={css.btnToggleSummary} onClick={toggleSummary}>
          <Icon name="dashboard-selected" size={32} />
        </Button>
      </Container>

      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <>
            <ProjectSelector
              module={ModuleName.CD}
              onSelect={project => {
                history.push(
                  routeCDDashboard.url({
                    orgIdentifier: project?.orgIdentifier as string,
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
