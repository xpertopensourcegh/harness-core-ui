const GitSourceProviders = {
  GITHUB: { label: 'GitHub', value: 'GITHUB', iconName: '' },
  GITLAB: { label: 'GitLab', value: 'GITLAB', iconName: '' },
  BITBUCKET: { label: 'BitBucket', value: 'BITBUCKET', iconName: '' },
  CUSTOM: { label: 'Custom', value: 'CUSTOM', iconName: '' }
}

export const triggerTypesMap = {
  webhook: {
    label: 'Webhook',
    value: 'WEBHOOK',
    items: [
      {
        label: GitSourceProviders.GITHUB.label,
        value: GitSourceProviders.GITHUB.value,
        iconName: GitSourceProviders.GITHUB.iconName,
        iconSize: 40
      },
      {
        label: GitSourceProviders.GITLAB.label,
        value: GitSourceProviders.GITLAB.value,
        iconName: GitSourceProviders.GITLAB.iconName,
        iconSize: 40
      },
      {
        label: GitSourceProviders.BITBUCKET.label,
        value: GitSourceProviders.BITBUCKET.value,
        iconName: GitSourceProviders.BITBUCKET.iconName,
        iconSize: 40
      },
      {
        label: GitSourceProviders.CUSTOM.label,
        value: GitSourceProviders.CUSTOM.value,
        iconName: GitSourceProviders.CUSTOM.iconName,
        iconSize: 40
      }
    ]
  }
}
