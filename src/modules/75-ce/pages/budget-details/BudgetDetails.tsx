import React from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Card, Color, Text, Icon, FontVariation, PageBody, PageHeader } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import BudgetDetailsSummary from '@ce/components/BudgetDetailsSummary/BudgetDetailsSummary'
import { useFetchBudgetsGridDataQuery, useFetchBudgetSummaryQuery } from 'services/ce/services'
import BudgetDetailsGrid from '@ce/components/BudgetDetailsGrid/BudgetDetailsGrid'
import BudgetDetailsChart from '@ce/components/BudgetDetailsChart/BudgetDetailsChart'
import css from './BudgetDetails.module.scss'

const BudgetDetails: () => JSX.Element | null = () => {
  const { accountId, budgetName, budgetId } = useParams<{ accountId: string; budgetName: string; budgetId: string }>()
  const { getString } = useStrings()

  const [{ data, fetching }] = useFetchBudgetSummaryQuery({
    variables: {
      id: budgetId
    }
  })

  const summaryData = data?.budgetSummary

  const [{ data: gridData, fetching: gridFetching }] = useFetchBudgetsGridDataQuery({
    variables: {
      id: budgetId
    }
  })

  return (
    <>
      <PageHeader
        title={budgetName}
        breadcrumbs={
          <Breadcrumbs
            links={[
              {
                url: routes.toCEBudgets({ accountId }),
                label: getString('ce.budgets.sideNavText')
              },
              {
                label: '',
                url: '#'
              }
            ]}
          />
        }
      />
      <PageBody loading={fetching}>
        <BudgetDetailsSummary summaryData={summaryData as any} />
        <Card className={cx(css.chartGridContainer, { [css.loadingContainer]: gridFetching })} elevation={1}>
          {gridFetching ? (
            <Icon name="spinner" size={26} color={Color.BLUE_500} />
          ) : (
            <>
              <Text
                margin={{
                  bottom: 'medium'
                }}
                color={Color.GREY_500}
                font={{ variation: FontVariation.H6 }}
              >
                Budget History
              </Text>
              <BudgetDetailsChart chartData={gridData?.budgetCostData as any} />
              <BudgetDetailsGrid gridData={gridData?.budgetCostData as any} />
            </>
          )}
        </Card>
      </PageBody>
    </>
  )
}

export default BudgetDetails
