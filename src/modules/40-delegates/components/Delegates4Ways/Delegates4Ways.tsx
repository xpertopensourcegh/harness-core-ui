import React from 'react'
import { Color, CardSelect, CardBody, Text, Heading, Layout } from '@wings-software/uicore'
import type { IconName } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import type { CardData } from '../CreateDelegate/commonSteps/DelegateDetailsStep'
import css from './Delegates4Ways.module.scss'

interface Delegates4WaysProps {
  onSelect: (value: CardData) => void
  selectedCard: CardData | undefined
}

const Delegates4Ways: React.FC<Delegates4WaysProps> = props => {
  const { onSelect, selectedCard } = props
  const { getString } = useStrings()
  const selectCardData: CardData[] = [
    {
      text: getString('delegate.cardData.docker.text'),
      value: getString('delegate.cardData.docker.value'),
      icon: getString('delegate.cardData.docker.icon'),
      name: getString('delegate.cardData.docker.name')
    },
    {
      text: getString('delegate.cardData.kubernetes.text'),
      value: getString('delegate.cardData.kubernetes.value'),
      icon: getString('delegate.cardData.kubernetes.icon'),
      name: getString('delegate.cardData.kubernetes.name')
    },
    {
      text: getString('delegate.cardData.amazonECS.text'),
      value: getString('delegate.cardData.amazonECS.value'),
      icon: getString('delegate.cardData.amazonECS.icon'),
      name: getString('delegate.cardData.amazonECS.name')
    },
    {
      text: getString('delegate.cardData.linux.text'),
      value: getString('delegate.cardData.linux.value'),
      icon: getString('delegate.cardData.linux.icon'),
      name: getString('delegate.cardData.linux.name')
    }
  ]

  return (
    <CardSelect
      data={selectCardData}
      cornerSelected={true}
      selected={selectCardData[selectCardData.findIndex(card => card.value === selectedCard?.value)]}
      renderItem={item => (
        <CardBody.Icon icon={item.icon as IconName} iconSize={20} className={css.cardBody}>
          <Layout.Vertical>
            <Heading level={3} font={{ weight: 'bold' }} color={Color.GREY_900}>
              {item.name}
            </Heading>
            <Text
              font={{ size: 'small', align: 'left' }}
              style={{
                color: Color.GREY_350
              }}
            >
              {item.text}
            </Text>
          </Layout.Vertical>
        </CardBody.Icon>
      )}
      onChange={value => {
        /* istanbul ignore next */
        onSelect(value)
      }}
      className={`grid ${css.cardWrapper}`}
    ></CardSelect>
  )
}

export default Delegates4Ways
