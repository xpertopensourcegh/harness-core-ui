import type { Editions } from '@common/constants/SubscriptionTypes'
import type { LicensesWithSummaryDTO } from 'services/cd-ng'
import type { StringsMap } from 'stringTypes'
import type { PlanCalculatedProps } from './PlanContainer'

export function getBtnProps(
  plan: any,
  licenseData: LicensesWithSummaryDTO | undefined,
  getString: (key: keyof StringsMap, vars?: Record<string, any> | undefined) => string,
  handleStartPlan: (planEdition: Editions) => Promise<void>,
  startingTrial: boolean,
  startingFreePlan: boolean
): PlanCalculatedProps['btnProps'] {
  let buttonText, onClick, isDisabled
  const planEdition = plan.title.toUpperCase() as Editions
  if (licenseData) {
    const { edition, licenseType } = licenseData
    if (edition === planEdition) {
      switch (licenseType) {
        case 'PAID':
          buttonText = getString('common.plans.manageSubscription')
          break
        case 'TRIAL':
          buttonText = getString('common.subscriptions.overview.subscribe')
          break
      }
      onClick = undefined
    } else {
      buttonText = getString('common.tryNow')
      onClick = undefined
      isDisabled = true
    }
  } else {
    buttonText = getString('common.tryNow')
    onClick = () => {
      handleStartPlan(planEdition)
    }
  }
  const btnLoading = startingTrial || startingFreePlan
  return {
    btnLoading,
    buttonText,
    onClick,
    isDisabled
  }
}
