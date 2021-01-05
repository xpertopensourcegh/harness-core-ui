import type { IconName } from '@wings-software/uicore'
import { DrawerContext, AddDrawerProps } from '../AddDrawer'

const triggerDrawerMap = {
  drawerLabel: 'Triggers',
  drawerSubLabel: 'All Trigger Types',
  searchPlaceholder: 'Search',
  showAllLabel: 'Show all Triggers',
  categories: [
    {
      categoryLabel: 'New Artifact/Manifest',
      categoryValue: 'OnArtifact',
      items: [
        {
          itemLabel: 'New Artifact',
          value: 'newArtifact1',
          iconName: 'trigger-artifact' as IconName
        },
        {
          itemLabel: 'New Manifest',
          value: 'NewManifest',
          iconName: 'trigger-artifact' as IconName
        }
      ]
    },
    {
      categoryLabel: 'Scheduled',
      categoryValue: 'OnSchedule',
      items: [
        {
          itemLabel: 'On Schedule',
          value: 'OnSchedule',
          iconName: 'trigger-schedule' as IconName
        }
      ]
    },
    {
      categoryLabel: 'Webhook',
      categoryValue: 'Webhook',
      items: [
        {
          itemLabel: 'GitHub',
          value: 'GITHUB',
          iconName: 'github' as IconName
        },
        {
          itemLabel: 'GitLab',
          value: 'GITLAB',
          iconName: 'service-gotlab' as IconName
        },
        {
          itemLabel: 'BitBucket',
          value: 'BITBUCKET',
          iconName: 'bitbucket' as IconName
        }
      ]
    }
  ]
}

export const getTriggerListDefaultProps = (): AddDrawerProps => ({
  addDrawerMap: triggerDrawerMap,
  drawerContext: DrawerContext.PAGE,
  onSelect: jest.fn(),
  onClose: jest.fn()
})
