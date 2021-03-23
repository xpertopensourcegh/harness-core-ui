export type ResourceGroup = Record<string, string>
export type ResourceGroupSelection = Record<string, boolean>
export enum ResourceType {
  PROJECT = 'PROJECT',
  SECRET = 'SECRET',
  ORGANIZATION = 'ORGANIZATION',
  CONNECTOR = 'CONNECTOR'
}

export enum ResourceTypeGroup {
  PROJECT_RESOURCES = 'PROJECT_RESOURCES',
  ADMINSTRATIVE_FUNCTIONS = 'ADMINSTRATIVE_FUNCTIONS'
}
