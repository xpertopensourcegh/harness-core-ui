import React from 'react'
import cx from 'classnames'
import { Container, Icon, Text, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { getServicesStates, getServicesTypes } from './ServiceDependenciesLegend.utils'
import css from './ServiceDependenciesLegend.module.scss'

export default function ServiceDependenciesLegend({ className }: { className?: string }): JSX.Element {
  const { getString } = useStrings()
  const servicesStates = getServicesStates()
  const serviceTypes = getServicesTypes()

  return (
    <Container padding={'medium'}>
      <Container className={cx(css.serviceStatesContainer, className)} background={Color.PRIMARY_1}>
        {servicesStates.map(state => {
          return (
            <Container flex key={state.identifier} padding={{ top: 'xsmall', right: 'xsmall' }}>
              <Container style={{ backgroundColor: state.color }} className={css.serviceState}></Container>
              <Text margin={{ right: 'small' }} font={{ size: 'xsmall' }}>
                {getString(state.label)}
              </Text>
            </Container>
          )
        })}
      </Container>
      <Container className={cx(css.serviceTypesContainer, className)} background={Color.PRIMARY_1}>
        {serviceTypes.map(type => {
          return (
            <Container flex key={type.identifier}>
              <Icon size={type.size} padding={{ left: 'xsmall', right: 'xsmall' }} name={type.icon} />
              <Text margin={{ right: 'small' }} font={{ size: 'xsmall' }}>
                {type.label}
              </Text>
            </Container>
          )
        })}
      </Container>
    </Container>
  )
}
