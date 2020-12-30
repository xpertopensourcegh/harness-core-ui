export default {
  connectorName: 'Kubernetes Connector Name',
  description: 'Description',
  identifier: 'Identifier',
  tags: 'Tags',
  created: 'Connector Created',
  lastTested: 'Last Tested',
  lastUpdated: 'Last Updated',
  lastConnectionSuccess: 'Last time connection is successful',
  failed: 'Failed',
  success: 'Success',
  overview: 'Overview',
  credentials: 'Credentials',

  delegate: 'Delegate',

  NAME_LABEL: {
    Kubernetes: 'Kubernetes Connector Name',
    GIT: 'GIT Connector Name',
    Github: 'GitHub Connector Name',
    Gitlab: 'GitLab Connector Name',
    Docker: 'Docker Connector Name',
    GCP: 'GCP Connector Name',
    AWS: 'AWS Connector Name',
    Nexus: 'Nexus Connector Name',
    Artifactory: 'Artifactory Connector Name',
    SecretManager: 'Secret Manager Name',
    AppDynamics: 'AppDynamics Connector Name',
    Splunk: ' Splunk Connector Name'
  },
  k8sCluster: {
    connectionMode: 'Connection Mode',
    delegateName: 'Delegate Name',
    delegateInCluster: 'Harness Delegate running In-Cluster',
    delegateOutCluster: 'Harness Delegate running Out-of-Cluster',
    credType: 'Credential Type',
    masterUrl: 'Master URL',
    username: 'Username',
    password: 'Password',
    serviceAccountToken: 'Service Account Token',
    identityProviderUrl: 'Identity Provider URL',
    oidcClientId: 'Client ID',
    clientSecret: 'Client Secret ',
    oidcScopes: 'OIDC Scopes',
    clientKey: 'Client Key',
    clientKeyPassphrase: 'Client Key Passphrase',
    clientCert: 'Client Certificate',
    clientAlgo: 'Client Key Algorithm',
    caCert: 'CA Certificate',
    encrypted: 'encrypted'
  },
  GIT: {
    configure: 'Configured',
    connection: 'Connection Type',
    url: 'URL',
    username: 'Username',
    password: 'Password',
    sshKey: 'SSH Encrypted Key',
    branchName: 'Branch Name',
    HTTP: 'HTTP',
    SSH: 'SSH'
  },
  Github: {
    configure: 'Configured',
    connection: 'Connection Type',
    url: 'URL',
    authType: 'Auth Type',
    username: 'Username',
    password: 'Password',
    accessToken: 'Access Token',
    apiAccessAuthType: 'API access authtype',
    installationId: 'Installation Id',
    applicationId: 'Application Id',
    sshKey: 'SSH Encrypted Key',
    branchName: 'Branch Name',
    HTTP: 'HTTP',
    SSH: 'SSH'
  },
  Docker: {
    dockerRegistryURL: 'Docker Registry URL',
    username: 'Username',
    password: 'Password'
  },
  Vault: {
    vaultUrl: 'Vault URL',
    engineName: 'Secret Engine Name',
    engineVersion: 'Secret Engine Version',
    renewal: 'Renewal Interval (hours)',
    readOnly: 'Read Only',
    default: 'Default',
    yes: 'Yes',
    no: 'No'
  },
  AWS: {
    STSEnabled: 'STS Role enabled',
    roleARN: 'Role ARN',
    externalId: 'External Id'
  },
  Nexus: {
    serverUrl: 'Nexus Server Url',
    version: 'Version'
  },
  Artifactory: {
    serverUrl: 'Artifactory Server Url',
    version: 'Version'
  },
  credType: 'Credential Type',
  delegateName: 'Delegate Name',
  username: 'Username',
  password: 'Password'
}
