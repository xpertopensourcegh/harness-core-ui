import React from 'react'
import { Button, ButtonSize, ButtonVariation, Color, Icon, Layout, Text } from '@wings-software/uicore'
import templateIllustration from '@templates-library/pages/TemplatesPage/images/templates-illustration.svg'
import { useStrings } from 'framework/strings'
import css from '@templates-library/pages/TemplatesPage/TemplatesPage.module.scss'

export interface NoResultsViewProps {
  hasSearchParam: boolean
  onReset: () => void
  text: string
}

export default function NoResultsView({ hasSearchParam, onReset, text }: NoResultsViewProps): React.ReactElement {
  const { getString } = useStrings()
  return (
    <Layout.Vertical height={'100%'} spacing={'xlarge'} flex={{ align: 'center-center' }}>
      {hasSearchParam ? (
        <>
          <Icon color={Color.GREY_400} name="template-library" size={50} />
          <Text font={{ weight: 'bold', size: 'medium' }} color={Color.GREY_400}>
            {getString('common.filters.noMatchingFilterData')}
          </Text>
          <Button
            variation={ButtonVariation.LINK}
            size={ButtonSize.LARGE}
            onClick={onReset}
            text={getString('common.filters.clearFilters')}
          />
        </>
      ) : (
        <>
          <img src={templateIllustration} className={css.illustration} />
          <Text font={{ size: 'large', weight: 'bold' }} color={Color.GREY_300}>
            {text}
          </Text>
        </>
      )}
    </Layout.Vertical>
  )
}
