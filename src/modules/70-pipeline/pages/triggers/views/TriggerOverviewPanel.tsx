import React from 'react'
import { Layout } from '@wings-software/uicore'
import cx from 'classnames'
import { NameIdDescriptionTags } from '@common/components'
import { useStrings } from 'framework/exports'
import css from './TriggerOverviewPanel.module.scss'

interface TriggerOverviewPanelPropsInterface {
  formikProps?: any
  isEdit?: boolean
}

const TriggerOverviewPanel: React.FC<TriggerOverviewPanelPropsInterface> = ({
  formikProps,
  isEdit = false
}): JSX.Element => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical className={cx(css.triggerOverviewPanelContainer)} spacing="large" padding="xxlarge">
      <h2>{getString('pipeline-triggers.triggerOverviewPanel.title')}</h2>
      <NameIdDescriptionTags
        className={css.nameIdDescriptionTags}
        formikProps={formikProps}
        identifierProps={{
          isIdentifierEditable: !isEdit
        }}
      />
    </Layout.Vertical>
  )
}
export default TriggerOverviewPanel
