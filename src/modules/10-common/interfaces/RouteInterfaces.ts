export interface AccountPathProps {
  accountId: string
}

export interface OrgPathProps extends AccountPathProps {
  orgIdentifier: string
}

export interface ProjectPathProps extends OrgPathProps {
  projectIdentifier: string
}

export interface PipelinePathProps extends ProjectPathProps {
  pipelineIdentifier: string
}
export interface PipelineStudioQueryParams {
  view?: 'ui' | 'yaml'
}
export interface InputSetPathProps extends PipelinePathProps {
  inputSetIdentifier: string
}
export interface TriggerPathProps extends PipelinePathProps {
  triggerIdentifier: string
  triggerType?: string
  sourceRepo?: string
}

export interface ExecutionPathProps extends PipelinePathProps {
  executionIdentifier: string
}

export interface BuildPathProps extends ProjectPathProps {
  buildIdentifier: string
}

export interface ConnectorPathProps {
  connectorId: string
}

export interface VerificationPathProps {
  verificationId: string
}
export interface SecretsPathProps {
  secretId: string
}

export interface DelegatePathProps {
  delegateId: string
}

export interface FeatureFlagPathProps {
  featureFlagIdentifier: string
}

export interface SegmentPathProps {
  segmentIdentifier: string
}
export interface TargetPathProps {
  targetIdentifier: string
}

export interface EnvironmentPathProps {
  environmentIdentifier: string
}

export interface CVDataSourceTypePathProps {
  dataSourceType: string
}

export type PipelineType<T> = T & { module: 'ci' | 'cd' | ':module' }

export type PathFn<T> = (props: AccountPathProps & T) => string
