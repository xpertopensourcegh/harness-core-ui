import React, { useMemo } from 'react'
import {
  Text,
  Heading,
  Container,
  StepProps,
  Layout,
  Button,
  FormInput,
  Formik,
  FormikForm
} from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/strings'
import type { Budget } from 'services/ce'
import css from '../PerspectiveCreateBudget.module.scss'

interface Props {
  name: string
  budget?: Budget
}

interface Form {
  type: 'SPECIFIED_AMOUNT' | 'PREVIOUS_MONTH_SPEND'
  budgetAmount: number
}

const SetBudgetAmount: React.FC<StepProps<Budget> & Props> = props => {
  const { getString } = useStrings()
  const { nextStep, prevStepData, budget: { lastMonthCost = 0, forecastCost = 0, budgetAmount = 0, type } = {} } = props

  const BUDGET_TYPE = useMemo(() => {
    return [
      { label: getString('ce.perspectives.budgets.setBudgetAmount.specifiedAmount'), value: 'SPECIFIED_AMOUNT' },
      { label: getString('ce.perspectives.budgets.setBudgetAmount.lastMonthSpend'), value: 'PREVIOUS_MONTH_SPEND' }
    ]
  }, [])

  const COSTS = useMemo(
    () => [
      [getString('ce.perspectives.budgets.setBudgetAmount.lastMonthCost'), lastMonthCost],
      [getString('ce.perspectives.budgets.setBudgetAmount.projectedCost'), forecastCost]
    ],
    []
  )

  const handleSubmit = (data: Form) => {
    const nextStepData: Budget = {
      ...((prevStepData || {}) as Budget),
      type: data.type,
      budgetAmount: data.budgetAmount
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
                <Text color="grey800" margin={{ bottom: 'small' }} font={{ size: 'small', weight: 'semi-bold' }}>
                  {cost[0]}
                </Text>
                <Text color="grey800" font={{ weight: 'bold', size: 'medium' }}>
                  {cost[1]}
                </Text>
              </div>
              {idx === 0 && <div className={css.separator}></div>}
            </>
          )
        })}
      </div>
    )
  }

  return (
    <Layout.Vertical className={css.stepContainer} spacing="xxlarge">
      <Heading level={2} color="grey800" font={{ size: 'medium', weight: 'semi-bold' }}>
        {getString('ce.perspectives.budgets.setBudgetAmount.title')}
      </Heading>
      {renderCosts()}
      <Container>
        <Formik<Form>
          onSubmit={data => {
            handleSubmit(data)
          }}
          formName="createReportScheduleForm"
          enableReinitialize={true}
          initialValues={{
            type: type || 'SPECIFIED_AMOUNT',
            budgetAmount
          }}
        >
          {formikProps => {
            return (
              <FormikForm>
                <Container style={{ minHeight: 350 }}>
                  <Container className={cx(css.main, css.dataFields)}>
                    <Layout.Vertical spacing="small">
                      <FormInput.Select
                        value={BUDGET_TYPE.find(op => op.value === formikProps.values.type)}
                        items={BUDGET_TYPE}
                        name={'type'}
                        label={getString('ce.perspectives.budgets.setBudgetAmount.budgetType')}
                      />
                      <FormInput.Text
                        name={'budgetAmount'}
                        label={getString('ce.perspectives.budgets.setBudgetAmount.specifyAmount')}
                      />
                    </Layout.Vertical>
                  </Container>
                </Container>
                <Layout.Horizontal spacing="medium">
                  <Button type="submit" intent="primary" rightIcon={'chevron-right'} disabled={false}>
                    {getString('continue')}
                  </Button>
                </Layout.Horizontal>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Layout.Vertical>
  )
}

export default SetBudgetAmount
