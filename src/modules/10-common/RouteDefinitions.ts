import { withAccountId } from '@common/utils/routeUtils'
import type {
  OrgPathProps,
  ConnectorPathProps,
  SecretsPathProps,
  DelegatePathProps,
  ProjectPathProps,
  PipelinePathProps,
  TriggerPathProps,
  ExecutionPathProps,
  FeatureFlagPathProps,
  BuildPathProps,
  CVDataSourceTypePathProps,
  EnvironmentPathProps,
  AccountPathProps,
  SegmentPathProps
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
  toResourcesDelegates: withAccountId(() => '/admin/resources/delegates'),
  toResourcesDelegatesDetails: withAccountId(
    ({ delegateId }: DelegatePathProps) => `/admin/resources/delegates/${delegateId}`
  ),
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
  toOrgResourcesDelegates: withAccountId(
    ({ orgIdentifier }: OrgPathProps) => `/admin/organizations/${orgIdentifier}/resources/delegates`
  ),
  toOrgResourcesDelegateDetails: withAccountId(
    ({ orgIdentifier, delegateId }: OrgPathProps & DelegatePathProps) =>
      `/admin/organizations/${orgIdentifier}/resources/delegates/${delegateId}`
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
  toCD: (params: Partial<ProjectPathProps>) =>
    params.orgIdentifier && params.projectIdentifier
      ? routes.toCDProject(params as ProjectPathProps)
      : routes.toCDDashboard(params as AccountPathProps),
  toCDDashboard: withAccountId(() => `/cd`),
  toCDHome: withAccountId(() => `/cd/home`),
  toCDProject: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCDProjectOverview: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/dashboard`
  ),
  toCDDeployments: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/deployments`
  ),

  toCDPipelineStudio: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/`
  ),
  toCDPipelineStudioUI: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/ui/`
  ),
  toCDPipelineStudioYaml: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/yaml/`
  ),

  toCDAdmin: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin`
  ),

  toCDResources: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources`
  ),
  toCDResourcesConnectors: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors`
  ),
  toCDResourcesConnectorDetails: withAccountId(
    ({ orgIdentifier, projectIdentifier, connectorId }: ProjectPathProps & ConnectorPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors/${connectorId}`
  ),
  toCDResourcesSecretsListing: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets`
  ),
  toCDResourcesSecretDetails: withAccountId(
    ({ orgIdentifier, projectIdentifier, secretId }: ProjectPathProps & SecretsPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets/${secretId}`
  ),
  toCDPipelines: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines`
  ),
  toCDPipelineDetail: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}`
  ),
  toCDInputSetList: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/input-sets`
  ),
  toCDTriggersPage: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/triggers`
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
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/triggers/${triggerIdentifier}${
        (triggerType && sourceRepo && `?triggerType=${triggerType}&sourceRepo=${sourceRepo}`) || ''
      }`
  ),
  toCDPipelineDeploymentList: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
  ),
  toCDExecution: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}`
  ),
  toCDExecutionPiplineView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/pipeline`
  ),
  toCDExecutionInputsView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/inputs`
  ),
  toCDExecutionArtifactsView: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }: ExecutionPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/artifacts`
  ),
  toCDTemplateLibrary: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/template-library`
  ),
  toCDGitSync: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/git-sync`
  ),
  toCDGovernance: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/governance`
  ),
  toCDAccessControl: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/governance`
  ),
  toCDGeneralSettings: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cd/orgs/${orgIdentifier}/projects/${projectIdentifier}/`
  ),

  /********************************************************************************************************************/
  toCI: (params: Partial<ProjectPathProps>) =>
    params.orgIdentifier && params.projectIdentifier
      ? routes.toCIProject(params as ProjectPathProps)
      : routes.toCIDashboard(params as AccountPathProps),
  toCIDashboard: withAccountId(() => `/ci`),
  toCIHome: withAccountId(() => `/ci/home`),
  toCIProject: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCIProjectOverview: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/dashboard`
  ),
  toCIPipelines: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines`
  ),
  toCIPipelineStudioUI: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/ui/`
  ),
  toCIPipelineStudioYaml: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/yaml/`
  ),
  toCIPipelineStudio: withAccountId(
    ({ orgIdentifier, projectIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipeline-studio/pipelines/${pipelineIdentifier}/`
  ),
  toCIPipelineDeploymentList: withAccountId(
    ({ projectIdentifier, orgIdentifier, pipelineIdentifier }: PipelinePathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
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
  toCIAdmin: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin`
  ),
  toCIAdminBuildSettings: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/build-settings`
  ),
  toCIAdminGovernance: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/governance`
  ),
  toCIAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources`
  ),
  toCIAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors`
  ),
  toCIAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets`
  ),
  toCIAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors/:connectorId`
  ),
  toCIAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets/:secretId`
  ),

  /********************************************************************************************************************/
  toCF: (params: Partial<ProjectPathProps>) =>
    params.orgIdentifier && params.projectIdentifier
      ? routes.toCFProject(params as ProjectPathProps)
      : routes.toCFDashboard(params as AccountPathProps),
  toCFDashboard: withAccountId(() => `/cf`),
  toCFHome: withAccountId(() => `/cf/home`),
  toCFProject: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCFProjectOverview: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/dashboard`
  ),
  toCFFeatureFlags: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/feature-flags`
  ),
  toCFFeatureFlagsDetail: withAccountId(
    ({
      orgIdentifier,
      projectIdentifier,
      featureFlagIdentifier,
      environmentIdentifier
    }: ProjectPathProps & FeatureFlagPathProps & EnvironmentPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/feature-flags/${featureFlagIdentifier}/environments/${environmentIdentifier}`
  ),
  toCFTargets: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/targets`
  ),
  toCFSegmentDetails: withAccountId(
    ({
      orgIdentifier,
      projectIdentifier,
      environmentIdentifier,
      segmentIdentifier
    }: ProjectPathProps & SegmentPathProps & EnvironmentPathProps) =>
      `/cf/targets/orgs/${orgIdentifier}/projects/${projectIdentifier}/environments/${environmentIdentifier}/segments/${segmentIdentifier}`
  ),
  toCFWorkflows: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/workflows`
  ),
  toCFAdmin: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin`
  ),
  toCFAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources`
  ),
  toCFAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors`
  ),
  toCFAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets`
  ),
  toCFAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors/:connectorId`
  ),
  toCFAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets/:secretId`
  ),
  toCFAdminGovernance: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cf/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/governance`
  ),

  /********************************************************************************************************************/
  toCV: (params: Partial<ProjectPathProps>) =>
    params.orgIdentifier && params.projectIdentifier
      ? routes.toCVProject(params as ProjectPathProps)
      : routes.toCVDashboard(params as AccountPathProps),
  toCVDashboard: withAccountId(() => `/cv`),
  toCVHome: withAccountId(() => `/cv/home`),
  toCVProject: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCVProjectOverview: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/dashboard`
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
        : `/cv/org/${orgIdentifier}/project/${projectIdentifier}/dashboard/deployment/${deploymentTag}/service/${serviceIdentifier}`
  ),
  toCVActivityChangesPage: withAccountId(
    ({ activityId, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & { activityId: string }>) =>
      !activityId || !projectIdentifier || !orgIdentifier
        ? CV_HOME
        : `/cv/org/${orgIdentifier}/project/${projectIdentifier}/dashboard/activity-changes/${activityId}`
  ),
  toCVDataSources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: Partial<ProjectPathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/datasources`
  ),
  toCVServices: withAccountId(
    ({ projectIdentifier, orgIdentifier }: Partial<ProjectPathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/services`
  ),
  toCVOnBoardingSetup: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/onboarding/${dataSourceType}/setup`
  ),
  toCVDataSourcesProductPage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/onboarding/${dataSourceType}/product`
  ),
  toCVSplunkInputTypePage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/onboarding/${dataSourceType}/input-type`
  ),
  toCVDataSourcesEntityPage: withAccountId(
    ({ dataSourceType, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & CVDataSourceTypePathProps>) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/onboarding/${dataSourceType}/select-list-entities`
  ),
  toCVActivitySourceSetup: withAccountId(
    ({ activitySource, projectIdentifier, orgIdentifier }: Partial<ProjectPathProps & { activitySource?: string }>) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/activity-source-setup/${activitySource}`
  ),
  toCVActivitySourceEditSetup: withAccountId(
    ({
      activitySource,
      projectIdentifier,
      orgIdentifier,
      activitySourceId
    }: Partial<ProjectPathProps & { activitySource?: string; activitySourceId: string }>) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/activity-source-setup/${activitySource}/activity-sourceId/${activitySourceId}`
  ),
  toCVMetricPackConfigureThresholdPage: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/metric-pack/config`
  ),
  toCVActivityDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/activities/dashboard`
  ),
  toCVActivities: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/project/${projectIdentifier}/activities`
  ),
  toCVAdminActivitySources: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/activity-sources`
  ),
  toCVActivityDetails: withAccountId(
    ({ activityType, orgIdentifier, projectIdentifier }: ProjectPathProps & { activityType: string }) =>
      `/cv/${activityType}/org/${orgIdentifier}/project/${projectIdentifier}/activities/setup`
  ),
  toCVAdminGeneralSettings: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/general-settings`
  ),
  toCVAdminGovernance: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/governance`
  ),
  toCVAdminSetup: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup`
  ),
  toCVAdminSetupMonitoringSource: withAccountId(
    ({ projectIdentifier, orgIdentifier, monitoringSource }: ProjectPathProps & { monitoringSource: string }) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/monitoring-source/${monitoringSource}`
  ),
  toCVAdmin: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin`
  ),
  toCVAdminResources: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources`
  ),
  toCVAdminResourcesConnectors: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors`
  ),
  toCVAdminResourcesSecretsListing: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets`
  ),
  toCVAdminResourcesConnectorDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/connectors/:connectorId`
  ),
  toCVAdminResourcesSecretDetails: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/resources/secrets/:secretId`
  ),
  toCVAdminAccessControl: withAccountId(
    ({ projectIdentifier, orgIdentifier }: ProjectPathProps) =>
      `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/admin/access-control`
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
  toProjectsGetStarted: withAccountId(() => '/projects/getstarted'),
  /********************************************************************************************************************/
  toCE: withAccountId(() => '/ce'),
  toCEHome: withAccountId(() => '/ce/home'),
  toCEDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ce/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  ),
  toCECostOptimizationDashboard: withAccountId(
    ({ orgIdentifier, projectIdentifier }: ProjectPathProps) =>
      `/ce/cost-opimizations/orgs/${orgIdentifier}/projects/${projectIdentifier}`
  )
}

export default routes
