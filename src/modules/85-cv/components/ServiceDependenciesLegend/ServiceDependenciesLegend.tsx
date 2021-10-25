import React from 'react'
import cx from 'classnames'
import { Container, Icon, Text, Color } from '@wings-software/uicore'
import type { MarginProps } from '@wings-software/uicore/dist/styled-props/margin/MarginProps'
import { useStrings } from 'framework/strings'
import { getServicesStates, getServicesTypes } from './ServiceDependenciesLegend.utils'
import css from './ServiceDependenciesLegend.module.scss'

interface ServiceDependenciesLegendProps {
  className?: string
  hideServiceTypeLegend?: boolean
  margin?: MarginProps
}

const ServiceDependenciesLegend: React.FC<ServiceDependenciesLegendProps> = ({
  className,
  hideServiceTypeLegend,
  margin
}) => {
  const { getString } = useStrings()
  const servicesStates = getServicesStates()
  const serviceTypes = getServicesTypes()

  return (
    <Container background={Color.PRIMARY_1} width="fit-content" className={css.container} margin={margin}>
      <Container className={cx(css.serviceStatesContainer, className)}>
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
      {!hideServiceTypeLegend ? (
        <Container className={cx(css.serviceTypesContainer, className)}>
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
      ) : null}
    </Container>
  )
}

export default ServiceDependenciesLegend
