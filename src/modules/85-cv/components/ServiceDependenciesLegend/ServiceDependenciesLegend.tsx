import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { getServicesStates } from './ServiceDependenciesLegend.utils'
import css from './ServiceDependenciesLegend.module.scss'

export default function ServiceDependenciesLegend(): JSX.Element {
  const { getString } = useStrings()
  const servicesStates = getServicesStates(getString)

  return (
    <Container className={css.dependenciesLegendsContainer}>
      {servicesStates.map(state => {
        return (
          <Container flex key={state.identifier}>
            <Container style={{ backgroundColor: state.color }} className={css.serviceState}></Container>
            <Text margin={{ right: 'small' }} font={{ size: 'xsmall' }}>
              {state.label}
            </Text>
          </Container>
        )
      })}
    </Container>
  )
}
