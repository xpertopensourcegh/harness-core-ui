export const getIconBySourceType = (type: string) => {
  switch (type) {
    case 'K8sCluster':
      return 'service-kubernetes'
    case 'AppDynamics':
      return 'service-appdynamics'
    case 'GoogleCloudOperations':
      return 'service-stackdriver'
    default:
      return ''
  }
}

export interface SetupIndexDBDataObject {
  name: string
  identifier: string
  type: string
  routeUrl: string
}

export interface SetupIndexDBData {
  monitoringSources: SetupIndexDBDataObject[]
  activitySources: SetupIndexDBDataObject[]
  verificationJobs: SetupIndexDBDataObject[]
}

export const STEP = {
  ACTIVITY_SOURCE: 'ACTIVITY_SOURCE',
  MONITORING_SOURCE: 'MONITORING_SOURCE',
  VERIFICATION_JOBS: 'VERIFICATION_JOBS'
}

export const ONBOARDING_ENTITIES = STEP

export interface BaseSetupTabsObject {
  name?: string
  identifier?: string
  sourceType?: 'ACTIVITY_SOURCE' | 'MONITORING_SOURCE' | 'VERIFICATION_JOBS'
  type?: string // Replace with types in apis
}
