import type {
  AccountPathProps,
  OrgPathProps,
  ProjectPathProps,
  PipelinePathProps,
  ExecutionPathProps,
  ConnectorPathProps,
  SecretsPathProps,
  PipelineType,
  FeatureFlagPathProps,
  CVDataSourceTypePathProps,
  BuildPathProps,
  EnvironmentPathProps
} from '@common/interfaces/RouteInterfaces'

export const accountPathProps: AccountPathProps = {
  accountId: ':accountId'
}

export const orgPathProps: OrgPathProps = {
  orgIdentifier: ':orgIdentifier'
}

export const projectPathProps: ProjectPathProps = {
  ...orgPathProps,
  projectIdentifier: ':projectIdentifier'
}

export const pipelinePathProps: PipelinePathProps = {
  ...projectPathProps,
  pipelineIdentifier: ':pipelineIdentifier'
}

export const executionPathProps: ExecutionPathProps = {
  ...pipelinePathProps,
  executionIdentifier: ':executionIdentifier'
}

export const connectorPathProps: ConnectorPathProps = {
  connectorId: ':connectorId'
}

export const secretPathProps: SecretsPathProps = {
  secretId: ':secretId'
}

export const pipelineModuleParams: Record<keyof PipelineType<{}>, string> = {
  module: ':module'
}

export const featureFlagPathProps: FeatureFlagPathProps = {
  featureFlagIdentifier: ':featureFlagIdentifier'
}

export const cvDataSourceTypePathProps: CVDataSourceTypePathProps = {
  dataSourceType: ':dataSourceType'
}

export const buildPathProps: BuildPathProps = {
  ...projectPathProps,
  buildIdentifier: ':buildIdentifier'
}

export const environmentPathProps: EnvironmentPathProps = {
  environmentIdentifier: ':environmentIdentifier'
}

export function withAccountId<T>(fn: (args: T) => string) {
  return (params: T & { accountId: string }) => {
    const path = fn(params)

    return `/account/${params.accountId}/${path.replace(/^\//, '')}`
  }
}
