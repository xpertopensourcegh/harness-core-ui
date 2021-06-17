import React, { useEffect, useState } from 'react'
import { Button, Heading, Layout, StepProps, CardSelect, Icon, IconName } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { CEAwsConnectorDTO } from './OverviewStep'
import css from '../CreateCeAwsConnector.module.scss'

enum Features {
  VISIBILITY,
  OPTIMIZATION,
  BILLING
}

export type FeaturesString = keyof typeof Features
interface CardData {
  icon: IconName
  text: string
  value: FeaturesString
  heading: string
}

const CrossAccountRoleStep1: React.FC<StepProps<CEAwsConnectorDTO>> = props => {
  const { getString } = useStrings()

  const { prevStepData, nextStep, previousStep } = props

  const cardData: CardData[] = [
    {
      icon: 'main-main-zoom_in',
      text: getString('connectors.ceAws.crossAccountRoleStep1.visibilityDes'),
      value: 'VISIBILITY',
      heading: getString('connectors.ceAws.crossAccountRoleStep1.visibility')
    },
    {
      icon: 'gear',
      text: getString('connectors.ceAws.crossAccountRoleStep1.optimizationDes'),
      value: 'OPTIMIZATION',
      heading: getString('connectors.ceAws.crossAccountRoleStep1.optimization')
    }
  ]

  const prevSelected: CardData[] = []
  useEffect(() => {
    if (prevStepData?.spec?.featuresEnabled) {
      prevStepData?.spec?.featuresEnabled.forEach((feat: FeaturesString) => {
        const num = Features[feat]
        if (num <= Features.OPTIMIZATION) {
          prevSelected.push(cardData[num])
        }
      })
    }
  })

  const [cardsSelected, setCardsSelected] = useState<CardData[]>(prevSelected)

  const handleSubmit = () => {
    const featuresEnabled: FeaturesString[] = cardsSelected.map(card => card.value)
    if (prevStepData?.includeBilling) featuresEnabled.push('BILLING')
    const newspec = {
      crossAccountAccess: { crossAccountRoleArn: '' },
      ...prevStepData?.spec,
      featuresEnabled
    }
    const payload = prevStepData
    if (payload) payload.spec = newspec
    nextStep?.(payload)
  }

  const handleprev = () => {
    previousStep?.({ ...(prevStepData as CEAwsConnectorDTO) })
  }

  const handleCardSelection = (item: CardData) => {
    const selectedAr = [...cardsSelected]
    const index = selectedAr.indexOf(item)
    if (index > -1) {
      selectedAr.splice(index, 1)
    } else {
      selectedAr.push(item)
    }
    setCardsSelected(selectedAr)
  }

  return (
    <Layout.Vertical className={css.stepContainer}>
      <Heading level={2} className={css.header}>
        {getString('connectors.ceAws.crossAccountRoleStep1.heading')}
      </Heading>
      <div className={css.infobox}>{getString('connectors.ceAws.crossAccountRoleStep1.subHeading')}</div>
      <div style={{ padding: 5, paddingBottom: 20 }}>
        {getString('connectors.ceAws.crossAccountRoleStep1.description')}
      </div>
      <div style={{ flex: 1 }}>
        <CardSelect
          data={cardData}
          selected={cardsSelected}
          multi={true}
          className={css.grid}
          onChange={item => {
            handleCardSelection(item)
          }}
          cornerSelected={true}
          renderItem={item => (
            <div>
              <div style={{ display: 'flex', paddingBottom: 7 }}>
                <Icon name={item.icon} size={32} color="primary5" style={{ paddingRight: 10 }}></Icon>
                <p>
                  <div style={{ fontSize: 8, fontFamily: 'inter' }}>
                    {getString('connectors.ceAws.crossAccountRoleStep1.cost')}
                  </div>{' '}
                  <div style={{ fontSize: 14, fontFamily: 'inter' }}>{item.heading}</div>
                </p>
              </div>
              <p>{item.text}</p>
            </div>
          )}
        ></CardSelect>

        <Layout.Horizontal className={css.buttonPanel} spacing="small">
          <Button text={getString('previous')} icon="chevron-left" onClick={handleprev}></Button>
          <Button
            type="submit"
            intent="primary"
            text={getString('continue')}
            rightIcon="chevron-right"
            onClick={handleSubmit}
            disabled={!prevStepData?.includeBilling && cardsSelected.length == 0}
          />
        </Layout.Horizontal>
      </div>
    </Layout.Vertical>
  )
}

export default CrossAccountRoleStep1
