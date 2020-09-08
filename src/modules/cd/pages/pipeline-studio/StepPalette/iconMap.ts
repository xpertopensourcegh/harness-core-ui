type iconMapOptions = {
  [key: string]: string
}

export const iconMap: iconMapOptions = {
  Placeholder: 'disable',
  K8sRollingRollback: 'main-rollback',
  K8sRollingDeploy: 'rolling',
  ShellScript: 'command-shell-script',
  Http: 'command-http'
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
