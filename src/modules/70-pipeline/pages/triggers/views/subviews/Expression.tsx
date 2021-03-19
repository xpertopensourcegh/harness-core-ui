import React from 'react'
import { Text, Container } from '@wings-software/uicore'
import cx from 'classnames'
import { isValidCron } from 'cron-validator'
import { useStrings } from 'framework/exports'
import { scheduleTabsId } from './ScheduleUtils'
import css from './Expression.module.scss'

interface ExpressionInterface {
  formikProps: any
}

const isCronValid = (formikProps: any): boolean => {
  const {
    values: { expression }
  } = formikProps

  const valid = isValidCron(expression || '')

  //   formikProps.setFieldValue('expression', valid ? expression : undefined)

  return valid
}

export default function Expression(props: ExpressionInterface): JSX.Element {
  const {
    formikProps: {
      values: { expression, selectedScheduleTab }
    },
    formikProps
  } = props
  const { getString } = useStrings()
  //   temporary for custom only
  const showError = selectedScheduleTab === scheduleTabsId.CUSTOM && !isCronValid(formikProps)
  return (
    <Container className={css.expression}>
      <Text className={css.label}>{getString('inputTypes.EXPRESSION')}</Text>
      <Container className={cx(css.field, (showError && css.errorField) || '')}>
        <Text>{expression}</Text>
        <Text>{isCronValid(formikProps)}</Text>
      </Container>
    </Container>
  )
}
