import React, { useState } from 'react'

import { Container } from '@wings-software/uikit'

import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import SelectProduct from '../SelectProduct/SelectProduct'
import i18n from './AppDMonitoringSource.i18n'

const AppDMonitoringSource = () => {
  const [data, setData] = useState({ name: '' })
  const { onNext, onPrevious, currentTab, maxEnabledTab } = useCVTabsHook()

  return (
    <Container>
      <CVOnboardingTabs
        type={'AppDynamics'}
        name={data.name || 'Default Name'}
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
            component: <div>{/* TODO */}</div>
          }
        ]}
      />
    </Container>
  )
}

export default AppDMonitoringSource
