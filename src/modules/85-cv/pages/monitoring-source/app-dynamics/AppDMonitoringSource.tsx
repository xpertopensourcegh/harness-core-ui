import React, { useState } from 'react'

import { Container } from '@wings-software/uikit'

import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import SelectProduct from '../SelectProduct/SelectProduct'
import SelectApplications from './SelectApplications/SelectApplications'
import i18n from './AppDMonitoringSource.i18n'
import MapApplications from './MapApplications/MapApplications'

const AppDMonitoringSource = () => {
  const [data, setData] = useState({ name: '' })
  const { onNext, onPrevious, currentTab, maxEnabledTab } = useCVTabsHook()

  return (
    <Container>
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
            title: i18n.selectProduct,
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
            title: i18n.selectApplication,
            component: (
              <SelectApplications
                stepData={data}
                onCompleteStep={stepData => {
                  setData({ ...data, ...stepData })
                  onNext()
                }}
              />
            )
          },
          {
            id: 3,
            title: i18n.mapApplications,
            component: <MapApplications />
          }
        ]}
      />
    </Container>
  )
}

export default AppDMonitoringSource
