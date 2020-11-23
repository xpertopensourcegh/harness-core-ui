import React from 'react'
import { Container } from '@wings-software/uikit'

import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import HarnessCDActivitySourceDetails from './HarnessCDActivitySourceDetails/HarnessCDActivitySourceDetails'
import SelectApplication from './SelectApplication/SelectApplication'
import SelectEnvironment from './SelectEnvironment/SelectEnvironment'
import SelectServices from './SelectServices/SelectServices'

const HarnessCDActivitySource: React.FC = () => {
  const { getString } = useStrings('cv')
  const { onNext, currentData, setCurrentData, onPrevious, ...tabInfo } = useCVTabsHook<any>()

  return (
    <Container>
      <CVOnboardingTabs
        iconName="cd-main"
        defaultEntityName={currentData?.name || getString('activitySources.harnessCD.defaultName')}
        {...tabInfo}
        onPrevious={onPrevious}
        onNext={onNext}
        setName={val => setCurrentData({ ...currentData, name: val })}
        tabProps={[
          {
            id: 1,
            title: getString('activitySources.harnessCD.selectActivitySource'),
            component: (
              <HarnessCDActivitySourceDetails
                initialValues={currentData}
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
              />
            )
          },
          {
            id: 2,
            title: getString('activitySources.harnessCD.selectApplication'),
            component: (
              <SelectApplication
                stepData={currentData}
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
                onPrevious={() => {
                  onPrevious()
                }}
              />
            )
          },
          {
            id: 3,
            title: getString('activitySources.harnessCD.selectEnvironment'),
            component: (
              <SelectEnvironment
                initialValues={currentData}
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
                onPrevious={() => {
                  onPrevious()
                }}
              />
            )
          },
          {
            id: 4,
            title: getString('activitySources.harnessCD.selectService'),
            component: (
              <SelectServices
                initialValues={currentData}
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
                onPrevious={() => {
                  onPrevious()
                }}
              />
            )
          }
        ]}
      />
    </Container>
  )
}
export default HarnessCDActivitySource
