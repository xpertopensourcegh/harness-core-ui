import { Container, Layout, Icon, Button } from '@wings-software/uikit'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Sidebar, isRouteActive, useRouteParams, useAppStoreReader, ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { ProjectSelector } from '@common/components/ProjectSelector/ProjectSelector'
import { AdminSelector, AdminSelectorLink } from '@common/components/AdminSelector/AdminSelector'
import i18n from './MenuCI.i18n'
import {
  routeCIDashboard,
  routeCIBuilds,
  routeCIAdminBuildSettings,
  routeCIAdminGovernance,
  routeCIAdminResources,
  routeCIBuild,
  routeCIPipelines,
  routeCIAdminResourcesConnectors,
  routeCIAdminResourcesSecretsListing,
  routeCIAdminResourcesConnectorDetails,
  routeCIAdminResourcesSecretDetails
} from '../routes'
import css from './MenuCI.module.scss'

//
// TODO: icons are not finalized and not available in UIKit
//
const ProjectNavLinks: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) return null

  const { orgIdentifier, identifier: projectIdentifier } = project as Required<Project>

  return (
    <>
      <Sidebar.Link
        href={routeCIDashboard.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.dashboard}
        icon="globe-network"
        selected={isRouteActive(routeCIDashboard)}
      />
      <Sidebar.Link
        href={routeCIBuilds.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.builds}
        icon="build"
        selected={isRouteActive(routeCIBuilds) || isRouteActive(routeCIBuild)}
      />
      <Sidebar.Link
        href={routeCIPipelines.url({
          orgIdentifier,
          projectIdentifier
        })}
        label={i18n.pipelines}
        icon="nav-pipelines"
        selected={isRouteActive(routeCIPipelines)}
      />
      <AdminSelector
        selected={
          isRouteActive(routeCIAdminBuildSettings) ||
          isRouteActive(routeCIAdminGovernance) ||
          isRouteActive(routeCIAdminResources) ||
          isRouteActive(routeCIAdminResourcesConnectors) ||
          isRouteActive(routeCIAdminResourcesSecretsListing) ||
          isRouteActive(routeCIAdminResourcesConnectorDetails) ||
          isRouteActive(routeCIAdminResourcesSecretDetails)
        }
      >
        <AdminSelectorLink
          href={routeCIAdminResources.url({ projectIdentifier, orgIdentifier })}
          label={i18n.resources}
          iconName="main-scope"
          selected={isRouteActive(routeCIAdminResources)}
        />
        <AdminSelectorLink
          href={routeCIAdminGovernance.url({ projectIdentifier })}
          label={i18n.governance}
          iconName="grid"
          selected={isRouteActive(routeCIAdminGovernance)}
        />
        <AdminSelectorLink
          href={routeCIAdminBuildSettings.url({ projectIdentifier })}
          label={i18n.buildSettings}
          iconName="git-repo"
          selected={isRouteActive(routeCIAdminBuildSettings)}
        />
      </AdminSelector>
    </>
  )
}

export const MenuCI: React.FC = () => {
  const {
    params: { projectIdentifier }
  } = useRouteParams()
  const history = useHistory()
  const { projects } = useAppStoreReader()
  const selectedProjectDTO = projects?.find(p => p.identifier === projectIdentifier)
  const toggleSummary = useCallback(() => {
    alert('TBD')
  }, [])

  return (
    <Layout.Vertical spacing="medium">
      <Container className={css.topBar}>
        <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.integration.toLocaleUpperCase()} />
        <Button noStyling className={css.btnToggleSummary} onClick={toggleSummary}>
          <Icon name="dashboard-selected" size={32} />
        </Button>
      </Container>

      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <>
            <ProjectSelector
              module={ModuleName.CI}
              onSelect={project => {
                history.push(
                  routeCIDashboard.url({
                    orgIdentifier: project?.orgIdentifier as string,
                    projectIdentifier: project.identifier as string
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
