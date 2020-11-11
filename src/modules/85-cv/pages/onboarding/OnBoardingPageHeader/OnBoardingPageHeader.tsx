import React, { useState } from 'react'
import { Color, Container, Tag } from '@wings-software/uikit'
import cx from 'classnames'
import { useRouteParams } from 'framework/exports'
import { Breadcrumb, Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import i18n from './OnBoardingPageHeader.i18n'
import css from './OnBoardingPageHeader.module.scss'

export interface OnBoardingPageHeader {
  breadCrumbs: Breadcrumb[]
}

export function OnBoardingPageHeader(props: OnBoardingPageHeader): JSX.Element {
  const { breadCrumbs } = props
  const {
    params: { projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const [selectedView, setSelectedView] = useState(i18n.visualAndYamlLabels.visual)
  return (
    <Container className={css.main}>
      <Container className={css.visualAndYaml} height={40} background={Color.GREY_100}>
        {Object.values(i18n.visualAndYamlLabels).map(view => (
          <Tag
            key={view}
            onClick={() => setSelectedView(view)}
            className={cx(css.viewSelection, view !== selectedView ? css.notSelectedView : undefined)}
          >
            {view}
          </Tag>
        ))}
      </Container>
      <Container background={Color.GREY_100} height={40} className={css.breadcrumbs}>
        <Breadcrumbs
          links={[
            {
              url: routeCVAdminSetup.url({
                orgIdentifier: orgIdentifier as string,
                projectIdentifier: projectIdentifier as string
              }),
              label: i18n.breadCrumbSetupLabel
            },
            ...breadCrumbs
          ]}
        />
      </Container>
    </Container>
  )
}
