import React from 'react'
import { Intent, ProgressBar } from '@blueprintjs/core'
import { Icon, Layout, Text } from '@wings-software/uikit'
import { useStrings } from 'framework/exports'
import css from './BuildTests.module.scss'

export const BuildLoadingState: React.FC = () => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical className={css.loadingContainer}>
      <Icon name="report-gear" size={100} style={{ margin: '0 auto', paddingBottom: 'var(--spacing-xxxlarge)' }} />
      <ProgressBar className={css.progress} animate={true} intent={Intent.PRIMARY} stripes={true} />
      <Text font={{ size: 'medium' }} padding={{ top: 'medium' }}>
        {getString('ci.testsReports.hangTight')}
      </Text>
    </Layout.Vertical>
  )
}
