import React from 'react'
import { Color, Text, Icon, IconName, Heading, Card, Layout } from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/strings'
import type { Module } from '@common/interfaces/RouteInterfaces'
import type { StringsMap } from 'stringTypes'

import css from './ModuleInfoCards.module.scss'
interface InfoCards {
  [key: string]: Array<ModuleInfoCard>
}

interface ModuleInfoCardsProps {
  module: Module
  selectedInfoCard: ModuleInfoCard | undefined
  setSelectedInfoCard: (moduleInfoCard: ModuleInfoCard) => void
  style?: React.CSSProperties
}

export interface ModuleInfoCard {
  icon: IconName
  title: string
  subtitle: string
  description: string
  route?: string
  isNgRoute?: boolean
}

export const INFO_CARD_PROPS: InfoCards = {
  ce: [
    {
      icon: 'ce-optimization',
      title: 'common.ce.cost',
      subtitle: 'common.ce.optimization',
      description: 'common.purpose.ce.optimizationCard.description',
      isNgRoute: true
    },
    {
      icon: 'ce-visibility',
      title: 'common.ce.cost',
      subtitle: 'common.ce.visibility',
      description: 'common.purpose.ce.visibilityCard.description',
      route: '/continuous-efficiency/settings'
    }
  ]
}
const ModuleInfoCards: React.FC<ModuleInfoCardsProps> = props => {
  const { module, selectedInfoCard, setSelectedInfoCard, style } = props
  const { getString } = useStrings()

  const getModuleInfoCards = (infoCard: ModuleInfoCard): React.ReactElement => {
    return (
      <Card
        key={infoCard.subtitle}
        className={cx(css.card, css.infoCard, selectedInfoCard?.subtitle === infoCard.subtitle ? css.selected : '')}
        onClick={() => setSelectedInfoCard(infoCard)}
      >
        <Layout.Horizontal spacing="small">
          <Icon name={infoCard.icon} size={40} />
          <div>
            <Text font="xsmall">{getString(infoCard.title as keyof StringsMap)}</Text>
            <Text font={{ size: 'medium' }} padding={{ bottom: 'large' }} color={Color.BLACK}>
              {getString(infoCard.subtitle as keyof StringsMap)}
            </Text>
          </div>
        </Layout.Horizontal>
        <Text font="small" padding={{ bottom: 'small' }} style={{ minHeight: 70 }}>
          {getString(infoCard.description as keyof StringsMap)}
        </Text>
      </Card>
    )
  }

  const infoCardProps = INFO_CARD_PROPS[module]

  const infoCards = infoCardProps?.map(cardProps => getModuleInfoCards(cardProps))

  if (!infoCardProps) {
    return <></>
  }

  return (
    <>
      <Heading color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }} padding={{ top: 'xlarge' }}>
        {getString('common.purpose.infoCardIntent')}
      </Heading>
      <Layout.Horizontal spacing="small" style={{ ...style }}>
        {infoCards}
      </Layout.Horizontal>
    </>
  )
}

export default ModuleInfoCards
