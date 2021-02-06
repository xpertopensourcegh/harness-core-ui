import type { HealthCheck, PortConfig } from 'services/lw'

interface Instance {
  filterText: string
}
interface CloudAccount {
  id: string
  name: string
}

interface Routing {
  instance: Instance
  lb: string
  ports: PortConfig[]
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
  healthCheck: HealthCheck
  opts: ServiceOpts
  provider: Provider
  selectedInstances: InstanceDetails[]
  accessPointID: string
  accountID: string
  connectionMetadata: ConnectionMetadata
}

interface DNSLink {
  selected: boolean
  public?: string
}
interface SSH {
  selected: boolean
}

interface RDP {
  selected: boolean
}
interface BackgroundTasks {
  selected: boolean
}
interface IpAddress {
  selected: boolean
}
interface ConnectionMetadata {
  dnsLink: DNSLink
  ssh: SSH
  rdp: RDP
  backgroundTasks: BackgroundTasks
  ipaddress: IpAddress
}
