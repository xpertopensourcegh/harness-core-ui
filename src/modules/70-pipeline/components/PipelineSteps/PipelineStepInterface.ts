export enum StepType {
  HTTP = 'Http',
  SHELLSCRIPT = 'ShellScript',
  APPROVAL = 'Approval',
  K8sRollingRollback = 'K8sRollingRollback',
  StepGroup = 'StepGroup',
  KubernetesInfraSpec = 'KubernetesInfraSpec',
  K8sRollingDeploy = 'K8sRollingDeploy',
  CustomVariable = 'Custom_Variable',
  Redis = 'service',
  Plugin = 'plugin',
  Run = 'run',
  SaveCache = 'Save_Cache',
  RestoreCache = 'Restore_Cache',
  GCR = 'GCR'
}
