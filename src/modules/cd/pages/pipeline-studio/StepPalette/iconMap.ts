type iconMapOptions = {
  [key: string]: string
}

export const iconMap: iconMapOptions = {
  APPLY: 'main-code-yaml',
  SCALE: 'swap-vertical',
  STAGE_DEPLOYMENT: 'pipeline-deploy',
  ROLLOUT_DEPLOYMENT: 'rolling',
  K8S_ROLLING: 'rolling',
  SWAP_SELECTORS: 'command-swap',
  DELETE: 'main-trash',
  CANARY_DEPLOYMENT: 'main-canary',
  TERRAFORM_APPLY: 'service-terraform',
  TERRAFORM_PROVISION: 'service-terraform',
  TERRAFORM_DELETE: 'service-terraform',
  CREATE_STACK: 'service-cloudformation',
  DELETE_STACK: 'service-cloudformation',
  SHELL_SCRIPT_PROVISIONER: 'command-shell-script',
  JIRA: 'service-jira',
  SERVICENOW: 'service-servicenow',
  EMAIL: 'command-email',
  BARRIERS: 'command-barrier',
  SHELL_SCRIPT: 'command-shell-script',
  HTTP_CHECK: 'command-http',
  NEW_RELIC_DEPLOYMENT_MAKER: 'service-newrelic',
  TEMPLATIZED_SECRET_MANAGER: 'main-template-library'
}

// This is temporary, need to get types as above for icons
export const iconMapByName: iconMapOptions = {
  Kubernetes: 'service-kubernetes',
  'Infrastructure Provisioners': 'yaml-builder-env',
  'Issue Tracking': 'error',
  Notification: 'notifications',
  'Flow Control': 'flow-branch',
  Utilites: 'briefcase'
}
