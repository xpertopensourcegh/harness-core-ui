import React from 'react'
import { noop } from 'lodash-es'
import { Button, ButtonVariation, ExpandingSearchInput, Layout, Tab, Tabs } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import GitFilters from '@common/components/GitFilters/GitFilters'
import styles from '@gitsync/pages/errors/GitSyncErrors.module.scss'

const GitSyncErrors: React.FC = () => {
  const { getString } = useStrings()
  return (
    <div className={styles.tabContainer}>
      <Tabs id="gitSyncErrorsTab">
        <Layout.Horizontal className={styles.gitSyncErrorsHeaderSides}>
          <GitFilters defaultValue={{ repo: '', branch: '' }} onChange={noop} />
        </Layout.Horizontal>
        <Tab id={'allErrors'} panel={<></>} title={getString('common.allErrors')} />
        <Tab id={'connectivityErrors'} panel={<></>} title={getString('common.connectivityErrors')} />
        <Layout.Horizontal className={styles.gitSyncErrorsHeaderSides} flex={{ justifyContent: 'flex-end' }}>
          <ExpandingSearchInput
            alwaysExpanded
            width={250}
            placeholder={getString('search')}
            throttle={200}
            onChange={noop}
            className={styles.searchInput}
          />
          <Button variation={ButtonVariation.TERTIARY} icon="command-rollback" />
        </Layout.Horizontal>
      </Tabs>
    </div>
  )
}

export default GitSyncErrors
