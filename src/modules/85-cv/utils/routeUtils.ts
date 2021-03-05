export const ActivityDetailsActivityType = {
  BG: 'bg-verification',
  TEST: 'test-verification',
  CANARY: 'canary-verification',
  HEALTH: 'health-verification'
}

export const ActivityDetailsActivitySource = {
  KUBERNETES: 'kubernetes',
  AWS: 'aws',
  AZURE: 'azure',
  GCP: 'gcp'
}

export const DataSourceRoutePaths = {
  APP_DYNAMICS: 'app-dynamics',
  SPLUNK: 'splunk'
}

export const ActivitySourceSetupRoutePaths = {
  KUBERNETES: 'kubernetes',
  HARNESS_CD: 'harness-cd'
}
export const MonitoringSourceSetupRoutePaths = {
  APP_DYNAMICS: 'app-dynamics',
  GOOGLE_CLOUD_OPERATIONS: 'GoogleCloudOperations',
  NEW_RELIC: 'new-relic'
}

export const getRoutePathByType = (type: string) => {
  switch (type) {
    case 'KUBERNETES':
      return ActivitySourceSetupRoutePaths.KUBERNETES
    case 'HarnessCD_1.0':
      return ActivitySourceSetupRoutePaths.HARNESS_CD
    case 'AppDynamics':
      return MonitoringSourceSetupRoutePaths.APP_DYNAMICS
    case 'STACKDRIVER':
      return MonitoringSourceSetupRoutePaths.GOOGLE_CLOUD_OPERATIONS
    default:
      return ''
  }
}
