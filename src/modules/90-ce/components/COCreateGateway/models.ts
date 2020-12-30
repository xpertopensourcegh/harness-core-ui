interface Instance {
  filterText: string
}
interface CloudAccount {
  id: string
  name: string
}
interface RoutingRule {
  pathMatch: string
}
interface PortConfig {
  protocol: string
  targetProtocol: string
  port: number
  targetPort: number
  serverName: string
  action: string
  redirectURL: string
  routingRules: RoutingRule[]
}
interface Routing {
  instance: Instance
  lb: string
  ports: PortConfig[]
}
interface HealthCheck {
  protocol: string
  path: string
  port: number
  timeout: number
}
interface ServiceOpts {
  preservePrivateIP: boolean
  deleteCloudResources: boolean
  alwaysUsePrivateIP: boolean
}

export interface Provider {
  name: string
  icon: string
  value: string
}
export interface InstanceDetails {
  id: string
  name: string
  ipAddress?: string
  region: string
  type: string
  tags?: string
  launchTime?: string
  status: string
}
export interface GatewayDetails {
  name: string
  cloudAccount: CloudAccount
  idleTimeMins: number
  fullfilment: string
  filter: string
  kind: string
  orgID: string
  projectID: string
  hostName?: string
  customDomains?: string[]
  matchAllSubdomains?: boolean
  disabled?: boolean
  routing: Routing
  healthCheck?: HealthCheck
  opts?: ServiceOpts
  provider: Provider
  selectedInstances: InstanceDetails[]
}
