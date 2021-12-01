import React, { useCallback, useMemo } from 'react'
import { Color, Container, FontVariation, FormInput, Text } from '@wings-software/uicore'

import { DateRangePicker } from '@blueprintjs/datetime'
import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import { useStrings } from 'framework/strings'
import SLOTargetChart from '@cv/pages/slos/components/SLOTargetChart/SLOTargetChart'
import type { SLOTargetAndBudgetPolicyProps } from './SLOTargetAndBudgetPolicy.types'
import {
  getDefaultDateRange,
  getPeriodLengthOptions,
  getPeriodTypeOptions,
  getUpdatedTarget
} from './SLOTargetAndBudgetPolicy.utils'
import { PeriodTypeEnum } from './SLOTargetAndBudgetPolicy.constants'
import css from './SLOTargetAndBudgetPolicy.module.scss'

export default function SLOTargetAndBudgetPolicy(props: SLOTargetAndBudgetPolicyProps): JSX.Element {
  const {
    children,
    formikProps: { values, setFieldValue },
    formikProps
  } = props

  const { getString } = useStrings()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const periodTypeOptions = useMemo(() => getPeriodTypeOptions(getString), [])
  const periodLengthOptions = useMemo(() => getPeriodLengthOptions(), [])

  const handleOnChangeDateRange = useCallback(
    range => {
      if (range[0] && range[1]) {
        const updatedTarget = getUpdatedTarget(range, values)
        setFieldValue('target', updatedTarget)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values?.target]
  )

  const renderPeriodLength = useCallback(() => {
    if (values?.target?.type === PeriodTypeEnum.CALENDAR) {
      return (
        <DateRangePicker
          className={css.dateRangePicker}
          defaultValue={getDefaultDateRange(formikProps)}
          maxDate={new Date()}
          onChange={handleOnChangeDateRange}
          allowSingleDayRange={true}
        />
      )
    } else {
      return (
        <FormInput.Select
          name="target.spec.periodLength"
          label={<Text font={{ size: 'small' }}>{getString('cv.slos.sloTargetAndBudget.periodLength')}</Text>}
          placeholder={getString('cv.slos.sloTargetAndBudget.selectPeriodLength')}
          items={periodLengthOptions}
          className={css.periodLengthDropdown}
        />
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.target?.type, periodLengthOptions])

  return (
    <>
      <Text color={Color.BLACK} className={css.label}>
        {getString('cv.slos.sloTargetAndBudget.setSLOTarget')}
      </Text>
      <CardWithOuterTitle className={css.sloTargetAndPolicyContainer}>
        <Container className={css.row}>
          <FormInput.Select
            name="target.type"
            label={<Text font={{ size: 'small' }}>{getString('cv.slos.sloTargetAndBudget.periodType')}</Text>}
            placeholder={getString('cv.slos.sloTargetAndBudget.selectPeriodType')}
            items={periodTypeOptions}
            className={css.targetTypeDropdown}
          />
          {renderPeriodLength()}
        </Container>

        <Text font={{ variation: FontVariation.FORM_LABEL }} padding={{ bottom: 'small' }}>
          {getString('cv.SLOTarget')}
        </Text>
        <SLOTargetChart
          bottomLabel={
            <Text
              color={Color.GREY_500}
              font={{ variation: FontVariation.SMALL_SEMI }}
              margin={{ top: 'large', left: 'xxxlarge' }}
              icon="symbol-square"
              iconProps={{ color: Color.PRIMARY_4 }}
            >
              {getString('cv.SLIMetricRatio')}
            </Text>
          }
        />
      </CardWithOuterTitle>
      {children}
    </>
  )
}
