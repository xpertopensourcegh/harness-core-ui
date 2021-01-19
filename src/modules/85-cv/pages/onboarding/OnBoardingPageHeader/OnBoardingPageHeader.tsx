import React, { useState } from 'react'
import { Color, Container, Tag } from '@wings-software/uicore'
import cx from 'classnames'
import { useParams } from 'react-router-dom'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { Breadcrumb, Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import i18n from './OnBoardingPageHeader.i18n'
import css from './OnBoardingPageHeader.module.scss'

export interface OnBoardingPageHeader {
  breadCrumbs: Breadcrumb[]
}

export function OnBoardingPageHeader(props: OnBoardingPageHeader): JSX.Element {
  const { breadCrumbs } = props
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
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
              url: routes.toCVAdminSetup({
                orgIdentifier: orgIdentifier as string,
                projectIdentifier: projectIdentifier as string,
                accountId
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
