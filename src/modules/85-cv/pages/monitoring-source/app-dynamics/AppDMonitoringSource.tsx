import React from 'react'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import type { BaseSetupTabsObject } from '@cv/pages/admin/setup/SetupUtils'
import { SelectProduct } from '../SelectProduct/SelectProduct'
import SelectApplications from './SelectApplications/SelectApplications'
import MapApplications from './MapApplications/MapApplications'
import ReviewTiersAndApps from './ReviewTiersAndApps/ReviewTiersAndApps'

interface AppDMonitoringSourceDataType extends BaseSetupTabsObject {
  [key: string]: any // Add Types
}

const AppDMonitoringSource = () => {
  const { currentData, setCurrentData, onNext, onPrevious, currentTab, maxEnabledTab } = useCVTabsHook<
    AppDMonitoringSourceDataType
  >({ totalTabs: 4 })
  const { getString } = useStrings()

  return (
    <CVOnboardingTabs
      iconName="service-appdynamics"
      defaultEntityName={currentData?.name || 'Default Name'}
      setName={val => {
        setCurrentData({ ...currentData, name: val })
      }}
      onNext={onNext}
      onPrevious={onPrevious}
      currentTab={currentTab}
      maxEnabledTab={maxEnabledTab}
      tabProps={[
        {
          id: 1,
          title: getString('selectProduct'),
          component: (
            <SelectProduct
              stepData={currentData}
              type="AppDynamics"
              onCompleteStep={stepData => {
                setCurrentData({ ...currentData, ...stepData })
                onNext({ data: { ...currentData, ...stepData } })
              }}
            />
          )
        },
        {
          id: 2,
          title: getString('selectApplication'),
          component: (
            <SelectApplications
              stepData={{
                connectorIdentifier: currentData?.connectorRef?.value,
                applications: currentData?.applications
              }}
              onCompleteStep={stepData => {
                setCurrentData({ ...currentData, ...stepData })
                onNext({ data: { ...currentData, ...stepData } })
              }}
              onPrevious={onPrevious}
            />
          )
        },
        {
          id: 3,
          title: getString('mapApplications'),
          component: (
            <MapApplications
              stepData={{
                sourceName: currentData?.name,
                connectorIdentifier: currentData?.connectorRef?.value,
                productName: currentData?.product,
                applications: currentData?.applications,
                tiers: currentData?.tiers,
                metricPacks: currentData?.metricPacks
              }}
              onCompleteStep={stepData => {
                setCurrentData({ ...currentData, ...stepData })
                onNext({ data: { ...currentData, ...stepData } })
              }}
              onPrevious={onPrevious}
            />
          )
        },
        {
          id: 4,
          title: getString('review'),
          component: (
            <ReviewTiersAndApps
              stepData={currentData}
              onCompleteStep={stepData => {
                setCurrentData({ ...currentData, ...stepData })
                onNext({ data: { ...currentData, ...stepData } })
              }}
              onPrevious={onPrevious}
            />
          )
        }
      ]}
    />
  )
}

export default AppDMonitoringSource
