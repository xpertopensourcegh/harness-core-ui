import React, { useState } from 'react'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import { SelectProduct } from '../SelectProduct/SelectProduct'
import SelectApplications from './SelectApplications/SelectApplications'
import MapApplications from './MapApplications/MapApplications'
import ReviewTiersAndApps from './ReviewTiersAndApps/ReviewTiersAndApps'

const AppDMonitoringSource = () => {
  const [data, setData] = useState<any>({ name: '' })
  const { onNext, onPrevious, currentTab, maxEnabledTab } = useCVTabsHook()
  const { getString } = useStrings()

  return (
    <CVOnboardingTabs
      iconName="service-appdynamics"
      defaultEntityName={data.name || 'Default Name'}
      setName={val => {
        setData({ ...data, name: val })
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
              stepData={data}
              type="AppDynamics"
              onCompleteStep={stepData => {
                setData({ ...data, ...stepData })
                onNext()
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
                connectorIdentifier: data?.connectorRef?.value,
                applications: data?.applications
              }}
              onCompleteStep={stepData => {
                setData({ ...data, ...stepData })
                onNext()
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
                sourceName: data?.name,
                connectorIdentifier: data?.connectorRef?.value,
                productName: data?.product,
                applications: data?.applications,
                tiers: data?.tiers,
                metricPacks: data?.metricPacks
              }}
              onCompleteStep={stepData => {
                setData({ ...data, ...stepData })
                onNext()
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
              stepData={data}
              onCompleteStep={stepData => {
                setData({ ...data, ...stepData })
                onNext()
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
