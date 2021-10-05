import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { pick, cloneDeep } from 'lodash-es'
import { Layout } from '@wings-software/uicore'
import { useToaster } from '@common/components'
import { useTelemetry } from '@common/hooks/useTelemetry'
import { Category, TrialActions } from '@common/constants/TrackingConstants'
import type { FetchPlansQuery } from 'services/common/services'
import { useLicenseStore, handleUpdateLicenseStore } from 'framework/LicenseStore/LicenseStoreContext'
import { useStrings } from 'framework/strings'
import { useStartTrialLicense, StartTrialDTO, useGetLicensesAndSummary } from 'services/cd-ng'
import routes from '@common/RouteDefinitions'
import type { Module } from '@common/interfaces/RouteInterfaces'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { ModuleName } from 'framework/types/ModuleName'
import type { Editions } from '@common/constants/SubscriptionTypes'
import { ModuleLicenseType } from '@common/constants/SubscriptionTypes'
import type { TIME_TYPE } from './Plan'
import Plan from './Plan'

interface PlanProps {
  module: ModuleName
  plans?: NonNullable<FetchPlansQuery['pricing']>['ciSaasPlans' | 'ffPlans' | 'cdPlans' | 'ccPlans']
  timeType: TIME_TYPE
}
interface PlanCalculatedProps {
  btnProps: {
    buttonText?: string
    btnLoading: boolean
    onClick?: () => void
    isDisabled?: boolean
  }
  currentPlanProps: {
    isCurrentPlan?: boolean
    isTrial?: boolean
    isPaid?: boolean
  }
}

const PlanContainer: React.FC<PlanProps> = ({ plans, timeType, module }) => {
  const { showError } = useToaster()
  const { trackEvent } = useTelemetry()
  const { getString } = useStrings()
  const history = useHistory()
  const { accountId } = useParams<{
    accountId: string
  }>()
  const { mutate: startTrial, loading } = useStartTrialLicense({
    queryParams: {
      accountIdentifier: accountId
    }
  })
  const { licenseInformation, updateLicenseStore } = useLicenseStore()

  const moduleType = module.toUpperCase() as StartTrialDTO['moduleType']

  async function handleStartTrial(edition: Editions): Promise<void> {
    trackEvent(TrialActions.StartTrialClick, { category: Category.SIGNUP, module })
    try {
      const data = await startTrial({ moduleType, edition })

      handleUpdateLicenseStore(
        { ...licenseInformation },
        updateLicenseStore,
        module.toLowerCase() as Module,
        data?.data
      )

      if (module === ModuleName.CE) {
        history.push(routes.toCEOverview({ accountId }))
        return
      }

      let search
      if (licenseData?.licenseType === ModuleLicenseType.TRIAL) {
        search = '?trial=true'
      }
      history.push({
        pathname: routes.toModuleHome({ accountId, module: module.toLowerCase() as Module }),
        search
      })
    } catch (ex: any) {
      showError(ex.data?.message)
    }
  }

  const {
    data,
    error,
    refetch,
    loading: gettingLicense
  } = useGetLicensesAndSummary({
    queryParams: { moduleType },
    accountIdentifier: accountId
  })

  const licenseData = data?.data

  const updatedLicenseInfo = licenseData && {
    ...licenseInformation?.[moduleType],
    ...pick(licenseData, ['licenseType', 'edition']),
    expiryTime: licenseData.maxExpiryTime
  }

  useEffect(() => {
    handleUpdateLicenseStore(
      { ...licenseInformation },
      updateLicenseStore,
      module.toLowerCase() as Module,
      updatedLicenseInfo
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenseData])

  function getBtnProps(plan: any): PlanCalculatedProps['btnProps'] {
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
        handleStartTrial(planEdition)
      }
    }
    const btnLoading = loading
    return {
      btnLoading,
      buttonText,
      onClick,
      isDisabled
    }
  }

  function getPlanCalculatedProps(plan: any): PlanCalculatedProps {
    let isCurrentPlan, isTrial, isPaid
    const planEdition = plan?.title?.toUpperCase() as Editions
    if (licenseData?.edition === planEdition) {
      isCurrentPlan = true
    }

    switch (licenseData?.licenseType) {
      case 'PAID':
        isPaid = true
        break
      case 'TRIAL':
        isTrial = true
        break
    }

    const btnProps = getBtnProps(plan)

    return {
      currentPlanProps: {
        isCurrentPlan,
        isTrial,
        isPaid
      },
      btnProps
    }
  }

  const calculatedPlans = cloneDeep(plans)

  calculatedPlans?.map((plan: any) => {
    const calculatedProps = getPlanCalculatedProps(plan)
    const { btnProps, currentPlanProps } = calculatedProps
    plan.btnProps = btnProps
    plan.currentPlanProps = currentPlanProps
  })

  if (gettingLicense) {
    return <PageSpinner />
  }

  if (error) {
    return <PageError message={(error.data as Error)?.message} onClick={() => refetch()} />
  }

  return (
    <Layout.Horizontal spacing="large">
      {calculatedPlans?.map((plan: any) => (
        <Plan key={plan?.title} plan={plan} timeType={timeType} module={module} />
      ))}
    </Layout.Horizontal>
  )
}

export default PlanContainer
