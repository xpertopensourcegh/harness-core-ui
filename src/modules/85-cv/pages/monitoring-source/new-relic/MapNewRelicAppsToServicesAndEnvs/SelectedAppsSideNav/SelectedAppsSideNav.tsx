import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import { Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import css from './SelectedAppsSideNav.module.scss'

const LoadingCells = [1, 2, 3, 4, 5]

export interface SelectedAppsSideNavProps {
  selectedApps?: string[]
  loading?: boolean
}

export function SelectedAppsSideNav(props: SelectedAppsSideNavProps): JSX.Element {
  const { selectedApps, loading } = props
  const { getString } = useStrings()
  return (
    <Container className={css.main}>
      <Text className={css.navHeader}>{getString('cv.monitoringSources.newRelic.selectedApplications')}</Text>
      {loading
        ? LoadingCells.map(loadingCell => (
            <Container key={loadingCell} className={css.seletedAppContainer}>
              <Container className={cx(Classes.SKELETON, css.selectedApp)} height={16} width="100%" />
            </Container>
          ))
        : selectedApps?.map(selectedApp => {
            return (
              <Container key={selectedApp} className={css.seletedAppContainer}>
                <Text className={css.selectedApp}>{selectedApp}</Text>
              </Container>
            )
          })}
    </Container>
  )
}
