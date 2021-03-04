export default {
  artifacts: 'Artifacts',
  manifests: 'Manifests',
  variables: 'Variables',
  infraNameLabel: 'Name your environment',
  infraNamePlaceholderText: 'Enter your environment name',
  addDescription: 'description',
  addTags: 'tags',
  tagsLabel: 'Tags',
  removeLabel: 'remove',
  infraDetailsLabel: 'Infrastructure Details',
  infraSpecificationLabel: 'Infrastructure Specification',
  stageOverrideLabel: 'Stage Overrides',
  deploymentTypeLabel: 'Direct Connection',
  deploymentTypes: {
    kubernetes: 'Kubernetes',
    gk8engine: 'Gooogle Kubernetes Engine',
    azurek8s: 'Azure Kubernetes Service',
    ek8s: 'Elastic Kubernetes Service'
  },
  validation: {
    infraName: 'Environment name is required field'
  },
  infrastructureTypeLabel: 'Type of environment',
  infrastructureTypePlaceholder: 'Select type of environment',
  prodLabel: 'Production',
  nonProdLabel: 'Non-production',
  infraSpecHelpText: 'Select the best method for Harness to reach your Kubernetes Cluster'
}
