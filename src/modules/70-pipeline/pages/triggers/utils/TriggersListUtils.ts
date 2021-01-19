import type { IconName } from '@wings-software/uicore'
// temporary mock data
import type { AddDrawerMapInterface } from '@common/components/AddDrawer/AddDrawer'
import type { GetActionsListQueryParams } from 'services/pipeline-ng'
import { TriggerTypes } from './TriggersWizardPageUtils'

export const GitSourceProviders = {
  GITHUB: { value: 'GITHUB', iconName: 'github' },
  GITLAB: { value: 'GITLAB', iconName: 'service-gotlab' },
  BITBUCKET: { value: 'BITBUCKET', iconName: 'bitbucket' },
  CUSTOM: { value: 'CUSTOM', iconName: 'build' }
}

export const getTriggerIcon = ({
  type,
  webhookSourceRepo
}: {
  type: string
  webhookSourceRepo: GetActionsListQueryParams['sourceRepo'] | undefined | string // string temporary until backend
}): IconName => {
  const webhookSourceRepoIconName =
    webhookSourceRepo && GitSourceProviders[webhookSourceRepo as GetActionsListQueryParams['sourceRepo']]?.iconName
  if (type === TriggerTypes.WEBHOOK && webhookSourceRepoIconName) {
    return webhookSourceRepoIconName as IconName
  }
  // placeholder for now
  return GitSourceProviders.GITHUB?.iconName as IconName
}

const triggerDrawerMap = (getString: (key: string) => string): AddDrawerMapInterface => ({
  drawerLabel: getString('pipeline-triggers.triggersLabel'),
  drawerSubLabel: getString('pipeline-triggers.triggersSubLabel'),
  showAllLabel: getString('pipeline-triggers.showAllTriggers'),
  searchPlaceholder: getString('pipeline-triggers.searchPlaceholder'),
  categories: [
    // {
    //   categoryLabel: getString('pipeline-triggers.onNewArtifactLabel'),
    //   categoryValue: 'OnArtifact',
    //   items: [
    //     {
    //       itemLabel: getString('pipeline-triggers.newArtifactLabel'),
    //       value: 'NewArtifact',
    //       iconName: 'trigger-artifact' as IconName
    //     },
    //     {
    //       itemLabel: getString('pipeline-triggers.newManifestLabel'),
    //       value: 'NewManifest',
    //       iconName: 'trigger-artifact' as IconName
    //     }
    //   ]
    // },
    // {
    //   categoryLabel: getString('pipeline-triggers.scheduledLabel'),
    //   categoryValue: 'OnSchedule',
    //   items: [
    //     {
    //       itemLabel: getString('pipeline-triggers.onScheduleLabel'),
    //       value: 'OnSchedule',
    //       iconName: 'trigger-schedule' as IconName
    //     }
    //   ]
    // },
    {
      categoryLabel: getString('execution.triggerType.WEBHOOK'),
      categoryValue: 'Webhook',
      items: [
        {
          itemLabel: getString('repo-provider.githubLabel'),
          value: GitSourceProviders.GITHUB.value,
          iconName: GitSourceProviders.GITHUB.iconName as IconName
        },
        {
          itemLabel: getString('repo-provider.gitlabLabel'),
          value: GitSourceProviders.GITLAB.value,
          iconName: GitSourceProviders.GITLAB.iconName as IconName
        },
        {
          itemLabel: getString('repo-provider.bitbucketLabel'),
          value: GitSourceProviders.BITBUCKET.value,
          iconName: GitSourceProviders.BITBUCKET.iconName as IconName
        },
        {
          itemLabel: getString('repo-provider.customLabel'),
          value: GitSourceProviders.CUSTOM.value,
          iconName: GitSourceProviders.CUSTOM.iconName as IconName
        }
      ]
    }
  ]
})

export const getSourceRepoOptions = (getString: (str: string) => string): { label: string; value: string }[] => [
  { label: getString('repo-provider.githubLabel'), value: GitSourceProviders.GITHUB.value },
  { label: getString('repo-provider.gitlabLabel'), value: GitSourceProviders.GITLAB.value },
  { label: getString('repo-provider.bitbucketLabel'), value: GitSourceProviders.BITBUCKET.value },
  { label: getString('repo-provider.customLabel'), value: GitSourceProviders.CUSTOM.value }
]

export const getCategoryItems = (getString: (key: string) => string): AddDrawerMapInterface =>
  triggerDrawerMap(getString)

export interface ItemInterface {
  itemLabel: string
  iconName: IconName
  value: string
  visible?: boolean
  disabled?: boolean
  categoryValue?: string
}
