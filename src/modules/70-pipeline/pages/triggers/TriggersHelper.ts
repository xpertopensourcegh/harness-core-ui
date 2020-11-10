import i18n from './TriggersPage.i18n'

const GitSourceProviders = {
  GITHUB: { label: i18n.githubLabel, value: 'GITHUB', iconName: 'github' },
  GITLAB: { label: i18n.gitlabLabel, value: 'GITLAB', iconName: 'service-gotlab' },
  BITBUCKET: { label: i18n.bitbucketLabel, value: 'BITBUCKET', iconName: 'bitbucket' },
  CUSTOM: { label: i18n.customLabel, value: 'CUSTOM', iconName: 'build' }
}

export const triggerTypesMap = {
  name: i18n.onWebhookLabel,
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
