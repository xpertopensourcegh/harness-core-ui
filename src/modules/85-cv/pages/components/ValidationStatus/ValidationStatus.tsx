import React from 'react'
import { Layout, Text, Color, Button, Container } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ValidationStatusProps } from './ValidationStatus.types'
import { StatusOfValidation } from './ValidationStatus.constants'
import css from './ValidationStatus.module.scss'

export default function ValidationStatus(props: ValidationStatusProps): JSX.Element {
  const { onClick, onRetry, validationStatus, textToDisplay } = props
  const { getString } = useStrings()

  switch (validationStatus) {
    case StatusOfValidation.IN_PROGRESS:
      return (
        <Text icon="steps-spinner" iconProps={{ size: 16 }}>
          {textToDisplay || getString('cv.monitoringSources.appD.verificationsInProgress')}
        </Text>
      )
    case StatusOfValidation.NO_DATA:
      return (
        <Text icon="issue" iconProps={{ size: 16 }} intent="none" className={css.validationButton} onClick={onClick}>
          {textToDisplay || getString('cv.monitoringSources.appD.noData')}
        </Text>
      )
    case StatusOfValidation.SUCCESS:
      return (
        <Text
          icon="tick"
          iconProps={{ size: 16, color: Color.GREEN_500 }}
          className={css.validationButton}
          onClick={onClick}
        >
          {textToDisplay || getString('cv.monitoringSources.appD.validationsPassed')}
        </Text>
      )
    case StatusOfValidation.ERROR:
      return (
        <Layout.Horizontal spacing="small" className={css.errorStatus}>
          <Text
            icon="warning-sign"
            iconProps={{ size: 16, color: Color.RED_500 }}
            intent="danger"
            lineClamp={3}
            className={css.validationButton}
            onClick={onClick}
          >
            {textToDisplay || getString('cv.monitoringSources.appD.validationsFailed')}
          </Text>
          <Button
            icon="refresh"
            iconProps={{ size: 12 }}
            color={Color.BLUE_500}
            text={getString('retry')}
            onClick={onRetry}
          />
        </Layout.Horizontal>
      )
    default:
      return <Container />
  }
}
