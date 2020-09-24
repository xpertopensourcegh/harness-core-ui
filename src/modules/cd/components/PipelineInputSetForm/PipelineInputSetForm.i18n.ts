export default {
  pipelineVariables: 'Pipeline Variables',
  stageName: (name: string) => `Stage: ${name}`,
  stageVariables: 'Stage Variables',
  service: (name: string) => `Service: ${name}`,
  primaryArtifact: 'Primary Artifact',
  infrastructure: 'Infrastructure',
  execution: 'Execution',
  rollbackSteps: 'Rollback Steps'
}
