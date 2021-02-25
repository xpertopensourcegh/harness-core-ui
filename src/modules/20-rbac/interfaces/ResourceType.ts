export type ResourceGroup = Record<string, string>
export type ResourceGroupSelection = Record<string, boolean>
export enum ResourceType {
  PROJECT = 'PROJECT',
  SECRET = 'SECRET',
  ORGANIZATION = 'ORGANIZATION',
  SECRET_MANAGER = 'SECRET_MANAGER'
}
