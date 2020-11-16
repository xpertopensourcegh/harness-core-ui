import type { ConnectorCatalogueItem } from 'services/cd-ng'

const ConnectorCatalogueNames = new Map<ConnectorCatalogueItem['category'], string>()
ConnectorCatalogueNames.set('ARTIFACTORY', 'Artifact Repositories')
ConnectorCatalogueNames.set('CLOUD_PROVIDER', 'Cloud Providers')
ConnectorCatalogueNames.set('CODE_REPO', 'Code Repositories')
ConnectorCatalogueNames.set('MONITORING', 'Monitoring and Logging Systems')
ConnectorCatalogueNames.set('SECRET_MANAGER', 'Secret Managers')
ConnectorCatalogueNames.set('TICKETING', 'Ticketing Systems')

export { ConnectorCatalogueNames }
