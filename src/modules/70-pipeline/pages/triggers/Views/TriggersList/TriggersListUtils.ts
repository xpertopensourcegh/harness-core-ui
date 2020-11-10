import type { IconName } from '@wings-software/uikit'
// temporary mock data
import i18n from '../../TriggersPage.i18n'

const GitSourceProviders = {
  GITHUB: { label: i18n.githubLabel, value: 'GITHUB', iconName: 'github' },
  GITLAB: { label: i18n.gitlabLabel, value: 'GITLAB', iconName: 'service-gotlab' },
  BITBUCKET: { label: i18n.bitbucketLabel, value: 'BITBUCKET', iconName: 'bitbucket' },
  CUSTOM: { label: i18n.customLabel, value: 'CUSTOM', iconName: 'build' }
}

const triggerDrawerMap = {
  drawerLabel: 'Triggers',
  drawerSubLabel: 'All Trigger Types',
  showAllLabel: 'Show all Triggers',
  categories: [
    {
      categoryLabel: i18n.onNewArtifactLabel,
      items: [
        {
          itemLabel: 'new artifact 1',
          value: 'new artifact 1',
          iconName: GitSourceProviders.GITHUB.iconName as IconName
        },
        {
          itemLabel: GitSourceProviders.GITLAB.label,
          value: GitSourceProviders.GITLAB.value,
          iconName: GitSourceProviders.GITLAB.iconName as IconName
        }
      ]
    },
    {
      categoryLabel: i18n.onScheduleLabel,
      items: [
        {
          itemLabel: 'schedule value 1',
          value: 'schedule value 1',
          iconName: GitSourceProviders.GITHUB.iconName as IconName
        }
      ]
    },
    {
      categoryLabel: i18n.onWebhookLabel,
      items: [
        {
          itemLabel: GitSourceProviders.GITHUB.label,
          value: GitSourceProviders.GITHUB.value,
          iconName: GitSourceProviders.GITHUB.iconName as IconName
        },
        {
          itemLabel: GitSourceProviders.GITLAB.label,
          value: GitSourceProviders.GITLAB.value,
          iconName: GitSourceProviders.GITLAB.iconName as IconName
        },
        {
          itemLabel: GitSourceProviders.BITBUCKET.label,
          value: GitSourceProviders.BITBUCKET.value,
          iconName: GitSourceProviders.BITBUCKET.iconName as IconName
        },
        {
          itemLabel: GitSourceProviders.CUSTOM.label,
          value: GitSourceProviders.CUSTOM.value,
          iconName: GitSourceProviders.CUSTOM.iconName as IconName
        }
      ]
    }
  ]
}

export const getCategoryItems = () => triggerDrawerMap

export interface ItemInterface {
  itemLabel: string
  iconName: IconName
  value: string
  visible?: boolean
  disabled?: boolean
  categoryLabel?: string
}
