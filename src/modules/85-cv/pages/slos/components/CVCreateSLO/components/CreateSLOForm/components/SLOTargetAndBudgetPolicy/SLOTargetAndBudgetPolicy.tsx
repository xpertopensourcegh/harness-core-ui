import React from 'react'
import { Card, Color, FontVariation, FormInput, Heading, Icon, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import SLOTargetChart from '@cv/pages/slos/components/SLOTargetChart/SLOTargetChart'
import {
  getPeriodLengthOptions,
  getPeriodTypeOptions,
  getWindowEndOptionsForMonth,
  getWindowEndOptionsForWeek
} from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.utils'
import {
  SLOPanelProps,
  PeriodTypes,
  PeriodLengthTypes,
  SLOFormFields
} from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.types'
import css from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.module.scss'

const SLOTargetAndBudgetPolicy: React.FC<SLOPanelProps> = ({ formikProps, children }) => {
  const { getString } = useStrings()
  const { periodType, periodLengthType } = formikProps.values

  return (
    <>
      <Heading level={2} font={{ variation: FontVariation.FORM_TITLE }} margin={{ bottom: 'xsmall' }}>
        {getString('cv.slos.sloTargetAndBudget.setSLOTarget')}
      </Heading>
      <Card className={css.card}>
        <Layout.Horizontal spacing="medium">
          <FormInput.Select
            name={SLOFormFields.PERIOD_TYPE}
            label={getString('cv.slos.sloTargetAndBudget.periodType')}
            items={getPeriodTypeOptions(getString)}
          />
          {periodType === PeriodTypes.CALENDAR ? (
            <>
              <FormInput.Select
                name={SLOFormFields.PERIOD_LENGTH_TYPE}
                label={getString('cv.periodLength')}
                items={getPeriodLengthOptions(getString)}
              />
              {periodLengthType === PeriodLengthTypes.MONTHLY && (
                <FormInput.Select
                  name={SLOFormFields.DAY_OF_MONTH}
                  label={getString('cv.windowEndsDay')}
                  items={getWindowEndOptionsForMonth()}
                  disabled={!periodLengthType}
                />
              )}
              {periodLengthType === PeriodLengthTypes.WEEKLY && (
                <FormInput.Select
                  name={SLOFormFields.DAY_OF_WEEK}
                  label={getString('cv.widowEnds')}
                  items={getWindowEndOptionsForWeek(getString)}
                  disabled={!periodLengthType}
                />
              )}
            </>
          ) : (
            <FormInput.Select
              name={SLOFormFields.PERIOD_LENGTH}
              label={getString('cv.periodLengthDays')}
              items={getWindowEndOptionsForMonth()}
            />
          )}
        </Layout.Horizontal>

        <FormInput.Text
          name={SLOFormFields.SLO_TARGET_PERCENTAGE}
          label={getString('cv.SLOTarget')}
          inputGroup={{
            type: 'number',
            min: 0,
            max: 100,
            rightElement: <Icon name="percentage" padding="small" />
          }}
          className={css.sloTarget}
        />
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
      </Card>
      {children}
    </>
  )
}

export default SLOTargetAndBudgetPolicy
