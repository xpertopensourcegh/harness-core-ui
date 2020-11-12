export default {
  artifacts: 'Artifacts',
  manifests: 'Manifests',
  variables: 'Variables',
  serviceNameLabel: 'Name of your service',
  serviceNamePlaceholderText: 'Enter your service name',
  addDescription: 'description',
  addTags: 'tags',
  tagsLabel: 'Tags',
  removeLabel: 'remove',
  serviceSpecificationLabel: 'Service Specification',
  stageOverrideLabel: 'Stage Overrides',
  deploymentTypeLabel: 'Deployment Types',
  deploymentTypes: {
    kubernetes: 'Kubernetes',
    amazonEcs: 'Amazon ECS',
    amazonAmi: 'AWS AMI',
    awsCodeDeploy: 'CodeDeploy',
    winrm: 'WinRM',
    awsLambda: 'AWS Lambda',
    pcf: 'PCF',
    ssh: 'Secure Shell'
  },
  overidesCondition: 'Override service specification details for this stage',
  overideInfoText:
    'You can override manifests files, variables etc for each stage. You can also use pre-defined override sets from the service specification. ',
  validation: {
    serviceName: 'Service name is required field'
  },
  propagateFromLabel: 'Propagate from existing service',
  or: 'or',
  deployDifferentLabel: 'Deploy different service',
  serviceDetailLabel: 'Service Details',
  deploymentDetailsLabel: 'Deployment Details',
  artifactDetails: 'Artifact Details'
}
