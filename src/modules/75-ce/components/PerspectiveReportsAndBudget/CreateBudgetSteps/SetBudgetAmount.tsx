import React, { useMemo } from 'react'
import { get } from 'lodash-es'
import {
  Text,
  Container,
  StepProps,
  Layout,
  Button,
  FormInput,
  Formik,
  FormikForm,
  FontVariation,
  FlexExpander,
  DateInput,
  Color
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { Position } from '@blueprintjs/core'
import { Budget, useGetLastMonthCost, useGetForecastCost } from 'services/ce'
import formatCost from '@ce/utils/formatCost'
import { useStrings } from 'framework/strings'
import css from '../PerspectiveCreateBudget.module.scss'

interface Props {
  name: string
  budget?: Budget
  isEditMode: boolean
  perspective?: string
}

interface BudgetData extends Budget {
  perspective: string
  growthRate: number
  startDate: string | undefined
  budgetPeriod: string
}

interface Form {
  type: 'SPECIFIED_AMOUNT' | 'PREVIOUS_MONTH_SPEND'
  budgetAmount: number
  budgetPeriod: string
  startDate: string | undefined
  growthRate: number
  growthRateCheck: boolean
}

const SetBudgetAmount: React.FC<StepProps<BudgetData> & Props> = props => {
  const { getString } = useStrings()
  const { accountId } = useParams<{
    accountId: string
  }>()
  const {
    nextStep,
    prevStepData,
    previousStep,
    budget: { lastMonthCost = 0, forecastCost = 0, budgetAmount = 0, type } = {},
    isEditMode
  } = props

  const { budgetPeriod, startDate, growthRate, perspective } = prevStepData || {}

  const { data: lmc } = useGetLastMonthCost({
    queryParams: { accountIdentifier: accountId, perspectiveId: perspective }
  })

  const { data: fc } = useGetForecastCost({
    queryParams: { accountIdentifier: accountId, perspectiveId: perspective }
  })

  const BUDGET_TYPE = useMemo(() => {
    return [
      { label: getString('ce.perspectives.budgets.setBudgetAmount.specifiedAmount'), value: 'SPECIFIED_AMOUNT' },
      { label: getString('ce.perspectives.budgets.setBudgetAmount.lastMonthSpend'), value: 'PREVIOUS_MONTH_SPEND' }
    ]
  }, [])

  const COSTS = useMemo(
    () => [
      [getString('ce.perspectives.budgets.setBudgetAmount.lastMonthCost'), lmc?.resource],
      [getString('ce.perspectives.budgets.setBudgetAmount.projectedCost'), fc?.resource]
    ],
    [lmc?.resource, fc?.resource]
  )

  const handleSubmit = (data: Form) => {
    const nextStepData = {
      ...((prevStepData || {}) as Budget & { perspective: string }),
      type: data.type,
      budgetAmount: data.budgetAmount,
      lastMonthCost: lastMonthCost,
      forecastCost: forecastCost,
      budgetPeriod: data.budgetPeriod,
      startDate: data.startDate,
      growthRate: data.growthRate
    }

    nextStep?.(nextStepData)
  }

  const renderCosts = () => {
    return (
      <div className={css.costs}>
        {COSTS.map((cost, idx) => {
          return (
            <>
              <div key={idx}>
                <Text color="grey800" margin={{ bottom: 'small' }} font={{ variation: FontVariation.SMALL }}>
                  {cost[0] || 0}
                </Text>
                <Text color="grey800" font={{ variation: FontVariation.H5 }}>
                  {formatCost((cost[1] as number) || 0)}
                </Text>
              </div>
              {idx === 0 && <div className={css.separator}></div>}
            </>
          )
        })}
      </div>
    )
  }

  const BUDGET_PERIOD = useMemo(() => {
    return [{ label: getString('ce.perspectives.budgets.setBudgetAmount.budgetPeriods.monthly'), value: 'MONTHLY' }]
  }, [])

  return (
    <Container>
      <Formik<Form>
        onSubmit={data => {
          handleSubmit(data)
        }}
        formName="selectPerspective"
        enableReinitialize={true}
        initialValues={{
          type: type || get(prevStepData, 'type') || 'SPECIFIED_AMOUNT',
          budgetAmount: budgetAmount || get(prevStepData, 'budgetAmount') || 0,
          budgetPeriod: budgetPeriod || 'MONTHLY',
          startDate: startDate,
          growthRate: growthRate || 0,
          growthRateCheck: !!growthRate
        }}
      >
        {formikProps => {
          return (
            <FormikForm className={css.selectPerspectiveContainer}>
              <Container className={css.selectPerspectiveContainer}>
                <Text font={{ variation: FontVariation.H4 }}>
                  {getString('ce.perspectives.budgets.setBudgetAmount.title')}
                </Text>

                <Container
                  margin={{
                    top: 'xxlarge'
                  }}
                  className={css.setBudgetContainer}
                >
                  <Container
                    padding={{
                      right: 'medium'
                    }}
                  >
                    <FormInput.Select
                      disabled={isEditMode}
                      items={BUDGET_PERIOD}
                      name={'budgetPeriod'}
                      label={getString('ce.perspectives.budgets.setBudgetAmount.budgetPeriod')}
                    />
                    <Text font={{ variation: FontVariation.BODY2 }} color={Color.GREY_600}>
                      {getString('ce.perspectives.budgets.setBudgetAmount.monthStartsFrom')}
                    </Text>
                    <DateInput
                      disabled={isEditMode}
                      popoverProps={{
                        position: Position.BOTTOM
                      }}
                      value={startDate}
                      onChange={val => {
                        formikProps.setValues({
                          ...formikProps.values,
                          startDate: val
                        })
                      }}
                    />
                    <FormInput.Select
                      value={BUDGET_TYPE.find(op => op.value === formikProps.values.type)}
                      items={BUDGET_TYPE}
                      name={'type'}
                      label={getString('ce.perspectives.budgets.setBudgetAmount.budgetType')}
                      onChange={option => {
                        if (option.value === 'PREVIOUS_MONTH_SPEND') {
                          formikProps.setFieldValue('budgetAmount', lmc?.resource || 0)
                        }
                      }}
                    />
                    <FormInput.Text
                      disabled={formikProps.values.type === 'PREVIOUS_MONTH_SPEND'}
                      name={'budgetAmount'}
                      label={
                        formikProps.values.type === 'PREVIOUS_MONTH_SPEND'
                          ? getString('ce.perspectives.budgets.setBudgetAmount.lastMonthSpend')
                          : getString('ce.perspectives.budgets.setBudgetAmount.specifyAmount')
                      }
                    />
                    <FormInput.CheckBox
                      name="growthRateCheck"
                      label={getString('ce.perspectives.budgets.setBudgetAmount.growthRateCheck')}
                      tooltipProps={{
                        dataTooltipId: 'growthRateCheckbox'
                      }}
                    />
                    {formikProps.values.growthRateCheck ? (
                      <Layout.Horizontal
                        margin={{
                          top: 'xlarge'
                        }}
                        spacing="small"
                      >
                        <FormInput.Text
                          name={'growthRate'}
                          label={getString('ce.perspectives.budgets.setBudgetAmount.growthRateLabel')}
                        />
                        <Text
                          margin={{
                            top: 'xxlarge'
                          }}
                        >
                          %
                        </Text>
                      </Layout.Horizontal>
                    ) : null}
                  </Container>
                  <Container
                    padding={{
                      left: 'medium'
                    }}
                  >
                    {renderCosts()}
                  </Container>
                </Container>

                <FlexExpander />
                <Layout.Horizontal spacing="medium">
                  <Button
                    text={getString('previous')}
                    icon="chevron-left"
                    onClick={() => previousStep?.(prevStepData)}
                  />
                  <Button type="submit" intent="primary" rightIcon={'chevron-right'} disabled={false}>
                    {getString('continue')}
                  </Button>
                </Layout.Horizontal>
              </Container>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SetBudgetAmount
