import { withAccountId } from '@common/utils/routeUtils'
import type {
  OrgPathProps,
  ConnectorPathProps,
  SecretsPathProps,
  ProjectPathProps,
  PipelinePathProps,
  TriggerPathProps,
  ExecutionPathProps,
  FeatureFlagPathProps,
  BuildPathProps,
  CVDataSourceTypePathProps,
  EnvironmentPathProps
} from '@common/interfaces/RouteInterfaces'

const CV_HOME = `/cv/home`

const routes = {
  toAdmin: withAccountId(() => '/admin'),
  toSettings: withAccountId(() => '/settings'),
  toResources: withAccountId(() => '/admin/resources'),
  // account resources
  toResourcesConnectors: withAccountId(() => '/admin/resources/connectors'),
  toResourcesConnectorDetails: withAccountId(
    ({ connectorId }: ConnectorPathProps) => `/admin/resources/connectors/${connectorId}`
  ),
  toResourcesSecretsListing: withAccountId(() => '/admin/resources/secrets'),
  toResourcesSecretDetails: withAccountId(({ secretId }: SecretsPathProps) => `/admin/resources/secrets/${secretId}`),
  // org resources
  toOrgResources: withAccountId(({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/resources`),
  toOrgResourcesConnectors: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/resources/connectors`
  ),
  toOrgResourcesConnectorDetails: withAccountId(
    ({ orgIdentifier, connectorId }: OrgPathProps & ConnectorPathProps) =>
      `/admin/organizations/${orgIdentifier}/resources/connectors/${connectorId}`
  ),
  toOrgResourcesSecretsListing: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/resources/secrets`
  ),
  toOrgResourcesSecretDetails: withAccountId(
    ({ orgIdentifier, secretId }: OrgPathProps & SecretsPathProps) =>
      `/admin/organizations/${orgIdentifier}/resources/secrets/${secretId}`
  ),
  // git sync
  toGitSync: withAccountId(() => '/admin/git-sync'),
  toGitSyncRepos: withAccountId(() => '/admin/git-sync/repos'),
  toGitSyncActivities: withAccountId(() => '/admin/git-sync/activities'),
  toGitSyncEntities: withAccountId(() => '/admin/git-sync/entities'),
  toGitSyncErrors: withAccountId(() => '/admin/git-sync/errors'),
  // org git sync
  toOrgGitSync: withAccountId(({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/git-sync`),
  toOrgGitSyncRepos: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/git-sync/repos`
  ),
  toOrgGitSyncActivities: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/git-sync/activities`
  ),
  toOrgGitSyncEntities: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/git-sync/entities`
  ),
  toOrgGitSyncErrors: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/git-sync/errors`
  ),

  toOrgProjects: withAccountId(({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/projects`),
  toOrganizations: withAccountId(() => `/admin/organizations`),
  toOrganizationDetails: withAccountId(({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}`),
  toGovernance: withAccountId(() => '/admin/governance'),
  toOrgGovernance: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/governance/${orgIdentifier}`
  ),
  toCreateConnectorFromYaml: withAccountId(() => '/admin/create-connector-from-yaml'),
  toCreateSecretFromYaml: withAccountId(() => '/admin/create-secret-from-yaml'),

  /********************************************************************************************************************/
  toCD: withAccountId(() => `/cd`),
  toCDHome: withAccountId(() => `/cd/home`),
  toCDDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDDeployments: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/deployments/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),

  toCDPipelineStudio: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/`
  ),
  toCDPipelineStudioUI: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/ui/`
  ),
  toCDPipelineStudioYaml: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/yaml/`
  ),

  toCDAdmin: withAccountId(() => `/cd/admin`),

  toCDResources: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDResourcesConnectors: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
  ),
  toCDResourcesConnectorDetails: withAccountId(
    ({ orgIdentifier, projectIdentifier, connectorId }: ProjectPathProps & ConnectorPathProps) =>
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/${connectorId}`
  ),
  toCDResourcesSecretsListing: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
  ),
  toCDResourcesSecretDetails: withAccountId(
    ({ orgIdentifier, projectIdentifier, secretId }: ProjectPathProps & SecretsPathProps) =>
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/${secretId}`
  ),
  toCDPipelines: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDPipelineDetail: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}`
  ),
  toCDInputSetList: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/input-sets`
  ),
  toCDTriggersPage: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/triggers`
  ),
  toCDTriggersWizardPage: withAccountId(
    ({
      orgIdentifier,
      projectIdentifier,
      pipelineIdentifier,
      triggerIdentifier,
      triggerType,
      sourceRepo
    }: TriggerPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/triggers/${triggerIdentifier}${
        (triggerType && sourceRepo && `?triggerType=${triggerType}&sourceRepo=${sourceRepo}`) || ''
      }`
  ),
  toCDPipelineDeploymentList: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
  ),
  toCDExecution: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}`
  ),
  toCDExecutionPiplineView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/pipeline`
  ),
  toCDExecutionInputsView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/inputs`
  ),
  toCDExecutionArtifactsView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/artifacts`
  ),
  toCDTemplateLibrary: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/template-library/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDGitSync: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/git-sync/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDGovernance: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/governance/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDAccessControl: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/governance/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDGeneralSettings: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/admin/general-settings/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),

  /********************************************************************************************************************/
  toCI: withAccountId(() => `/ci`),
  toCIHome: withAccountId(() => `/ci/home`),
  toCIAdmin: withAccountId(() => `/ci/admin`),
  toCIDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCIPipelines: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCIPipelineStudioUI: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/ui/`
  ),
  toCIPipelineStudioYaml: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/yaml/`
  ),
  toCIPipelineStudio: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/`
  ),
  toCIPipelineDeploymentList: withAccountId(
    ({ projectIdentifier, orgIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
  ),
  toCIBuilds: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds`
  ),
  toCIBuildPipelineGraph: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/graph`
  ),
  toCIBuildPipelineLog: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/log`
  ),
  toCIBuildInputs: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/inputs`
  ),

  toCIBuildCommits: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/commits`
  ),

  toCIBuildTests: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/tests`
  ),
  toCIBuildArtifacts: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/artifacts`
  ),
  toCIBuild: withAccountId(
    ({ orgIdentifier, projectIdentifier, buildIdentifier }: BuildPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}`
  ),
  toCIAdminBuildSettings: withAccountId(
    ({ projectIdentifier }: Omit<ProjectPathProps, 'orgIdentifier'>) =>
      `/ci/admin/build-settings/projects/${projectIdentifier}`
  ),
  toCIAdminGovernance: withAccountId(
    ({ projectIdentifier }: Omit<ProjectPathProps, 'orgIdentifier'>) =>
      `/ci/admin/governance/projects/${projectIdentifier}`
  ),
  toCIAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
  ),
  toCIAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
  ),
  toCIAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/:connectorId`
  ),
  toCIAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/:secretId`
  ),
  toCIAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),

  /********************************************************************************************************************/
  toCF: withAccountId(() => `/cf`),
  toCFHome: withAccountId(() => `/cf/home`),
  toCFAdmin: withAccountId(() => `/cf/admin`),
  toCFDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCFFeatureFlags: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/feature-flags/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCFFeatureFlagsDetail: withAccountId(
    ({
      orgIdentifier,
      projectIdentifier,
      featureFlagIdentifier,
      environmentIdentifier
    }: ProjectPathProps & FeatureFlagPathProps & EnvironmentPathProps) =>
      `/cf/feature-flags/orgs/${orgIdentifier}/projects/${projectIdentifier}/features/${featureFlagIdentifier}/environments/${environmentIdentifier}`
  ),
  toCFTargets: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/targets/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCFWorkflows: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/workflows/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCFAdminGovernance: withAccountId(
    ({ projectIdentifier }: Omit<ProjectPathProps, 'orgIdentifier'>) =>
      `/cf/admin/governance/projects/${projectIdentifier}`
  ),
  toCFAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
  ),
  toCFAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
  ),
  toCFAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/:connectorId`
  ),
  toCFAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/:secretId`
  ),
  toCFAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),

  /********************************************************************************************************************/
  toCV: withAccountId(() => `/cv/`),
  toCVHome: withAccountId(() => `/cv/home`),
  toCVAdmin: withAccountId(() => `/cv/admin`),
  toCVMainDashBoardPage: withAccountId(({ projectIdentifier, orgIdentifier }: Partial<ProjectPathProps>) =>
    !projectIdentifier || !orgIdentifier ? CV_HOME : `/cv/dashboard/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVDeploymentPage: withAccountId(
    ({
      projectIdentifier,
      orgIdentifier,
      deploymentTag,
      serviceIdentifier
    }: Partial<ProjectPathProps> & Record<'deploymentTag' | 'serviceIdentifier', string>) =>
      !projectIdentifier || !orgIdentifier
        ? CV_HOME
        : `/cv/dashboard/deployment/${deploymentTag}/service/${serviceIdentifier}/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVActivityChangesPage: withAccountId(
    ({ activityId, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & { activityId: string }>) =>
      !activityId || !projectIdentifier || !orgIdentifier
        ? CV_HOME
        : `/cv/dashboard/activity-changes/${activityId}/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVDataSources: withAccountId(({ projectIdentifier, orgIdentifier }: Partial<ProjectPathProps>) =>
    projectIdentifier && orgIdentifier ? `/cv/datasources/org/${orgIdentifier}/project/${projectIdentifier}` : CV_HOME
  ),
  toCVServices: withAccountId(({ projectIdentifier, orgIdentifier }: Partial<ProjectPathProps>) =>
    projectIdentifier && orgIdentifier ? `/cv/services/org/${orgIdentifier}/project/${projectIdentifier}` : CV_HOME
  ),
  toCVOnBoardingSetup: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/setup/org/${orgIdentifier}/project/${projectIdentifier}`
        : CV_HOME
  ),
  toCVDataSourcesProductPage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/product/org/${orgIdentifier}/project/${projectIdentifier}`
        : CV_HOME
  ),
  toCVSplunkInputTypePage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/input-type/org/${orgIdentifier}/project/${projectIdentifier}`
        : CV_HOME
  ),
  toCVDataSourcesEntityPage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/select-list-entities/org/${orgIdentifier}/project/${projectIdentifier}`
        : CV_HOME
  ),
  toCVActivitySourceSetup: withAccountId(
    ({ activitySource, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & { activitySource?: string }>) =>
      activitySource && projectIdentifier && orgIdentifier
        ? `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/activity-source-setup/${activitySource}`
        : CV_HOME
  ),
  toCVActivitySourceEditSetup: withAccountId(
    ({
      activitySource,
      projectIdentifier,
      orgIdentifier,
      activitySourceId
    }: Partial<ProjectPathProps & { activitySource?: string; activitySourceId: string }>) =>
      activitySource && projectIdentifier && orgIdentifier
        ? `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/activity-source-setup/${activitySource}/activity-sourceId/${activitySourceId}`
        : CV_HOME
  ),
  toCVMetricPackConfigureThresholdPage: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/metric-pack/config/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVActivityDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/activities/dashboard/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVActivities: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/activities/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVAdminActivitySources: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/admin/activity-sources/org/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVActivityDetails: withAccountId(
    ({ activityType, orgIdentifier, projectIdentifier }: ProjectPathProps & { activityType: string }) =>
      `/cv/activities/setup/${activityType}/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toCVAdminGeneralSettings: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/general-settings/org/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVAdminGovernance: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/governance/org/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVAdminSetup: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/setup`
  ),
  toCVAdminSetupMonitoringSource: withAccountId(
    ({ projectIdentifier, orgIdentifier, monitoringSource }: ProjectPathProps & { monitoringSource: string }) =>
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/monitoring-source/${monitoringSource}`
  ),
  toCVAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
  ),
  toCVAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
  ),
  toCVAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/:connectorId`
  ),
  toCVAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/:secretId`
  ),
  toCVAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVAdminAccessControl: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/admin/access-control/org/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVAdminNotifications: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/notifications`
  ),
  /********************************************************************************************************************/
  toProjectDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) => `/org/${orgIdentifier}/project/${projectIdentifier}`
  ),
  toProjects: withAccountId(() => '/projects'),

  /********************************************************************************************************************/
  toCE: withAccountId(() => '/ce'),
  toCEHome: withAccountId(() => '/ce/home')
}

export default routes
