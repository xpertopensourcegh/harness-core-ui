import { Container, Layout, Icon, Button } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, routeParams, useAppStoreReader, ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
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
const ProjectNavLinks: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) return null

  const { identifier: projectIdentifier, orgIdentifier } = project as Required<Project>

  return (
    <>
      <Sidebar.Link
        href={routeCDDashboard.url({
          projectIdentifier
        })}
        label={i18n.dashboard}
        icon="globe-network"
        selected={isRouteActive(routeCDDashboard)}
      />
      <Sidebar.Link
        href={routeCDDeployments.url({
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
            projectIdentifier: project.identifier as string,
            orgIdentifier: project.orgIdentifier as string
          })}
          label={i18n.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCDResources)}
        />
        <AdminSelectorLink
          href={routeCDTemplateLibrary.url({ projectIdentifier: project.identifier as string })}
          label={i18n.templateLibrary}
          iconName="grid"
          selected={isRouteActive(routeCDTemplateLibrary)}
        />
        <AdminSelectorLink
          href={routeCDGitSync.url({ projectIdentifier: project.identifier as string })}
          label={i18n.gitSync}
          iconName="git-repo"
          selected={isRouteActive(routeCDGitSync)}
        />
        <AdminSelectorLink
          href={routeCDGovernance.url({ projectIdentifier: project.identifier as string })}
          label={i18n.governance}
          iconName="shield"
          selected={isRouteActive(routeCDGovernance)}
        />
        <AdminSelectorLink
          href={routeCDAccessControl.url({ projectIdentifier: project.identifier as string })}
          label={i18n.accessControl}
          iconName="user"
          selected={isRouteActive(routeCDAccessControl)}
        />
        <AdminSelectorLink
          href={routeCDGeneralSettings.url({ projectIdentifier: project.identifier as string })}
          label={i18n.generalSettings}
          iconName="settings"
          selected={isRouteActive(routeCDGeneralSettings)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCD: React.FC = () => {
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
                history.push(routeCDDashboard.url({ projectIdentifier: project.identifier as string }))
              }}
            />
            <ProjectNavLinks project={selectedProjectDTO} />
          </>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
