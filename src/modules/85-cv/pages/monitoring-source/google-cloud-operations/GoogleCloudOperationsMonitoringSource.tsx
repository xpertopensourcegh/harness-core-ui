import React from 'react'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import { Page } from '@common/exports'
import { SelectProduct } from '../SelectProduct/SelectProduct'

export function GoogleCloudOperationsMonitoringSource(): JSX.Element {
  const { getString } = useStrings()
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<any>()
  return (
    <Page.Body>
      <CVOnboardingTabs
        iconName="service-stackdriver"
        defaultEntityName={currentData?.name}
        setName={val => setCurrentData({ ...currentData, name: val })}
        onNext={onNext}
        {...tabInfo}
        tabProps={[
          {
            id: 1,
            component: (
              <SelectProduct
                stepData={currentData}
                type="GoogleCloudOperations"
                onCompleteStep={data => setCurrentData({ ...data })}
                productSelectValidationText={getString('cv.monitoringSources.gco.productValidationText')}
              />
            )
          }
        ]}
      />
    </Page.Body>
  )
}
