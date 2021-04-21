import React from 'react'
import { Color, Container } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { Breadcrumb, Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import css from './OnBoardingPageHeader.module.scss'

export interface OnBoardingPageHeader {
  breadCrumbs: Breadcrumb[]
}

export function OnBoardingPageHeader(props: OnBoardingPageHeader): JSX.Element {
  const { breadCrumbs } = props
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  return (
    <Container background={Color.GREY_100} height={40} className={css.breadcrumbs}>
      <Breadcrumbs
        links={[
          {
            url: routes.toCVAdminSetup({
              orgIdentifier,
              projectIdentifier,
              accountId
            }),
            label: getString('cv.navLinks.adminSideNavLinks.setup')
          },
          ...breadCrumbs
        ]}
      />
    </Container>
  )
}
