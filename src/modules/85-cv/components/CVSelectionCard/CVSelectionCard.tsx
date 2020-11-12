import React, { useState } from 'react'
import { Card, Icon, CardBody, Color, Container, Layout, Text } from '@wings-software/uikit'
import cx from 'classnames'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import css from './CVSelectionCard.module.scss'

export interface CVSelectionCardProps {
  isSelected?: boolean
  iconProps: IconProps
  className?: string
  renderLabelOutsideCard?: boolean
  isLarge?: boolean
  onCardSelect?: (isSelected: boolean) => void
  cardLabel?: string
}

export interface CVSelectionCardGroupProps {
  cards: Omit<CVSelectionCardProps[], 'onCardSelect'>
  defaultSelectedCardIndex?: number
  className?: string
}

export function CVSelectionCard(props: CVSelectionCardProps): JSX.Element {
  const { isSelected, iconProps, onCardSelect, cardLabel, renderLabelOutsideCard, className, isLarge } = props
  return (
    <Layout.Vertical spacing="small" className={className}>
      <Card
        selected={isSelected}
        interactive={true}
        className={cx(
          css.selectionCard,
          isSelected ? css.selectedCard : undefined,
          isLarge ? css.largeCard : undefined
        )}
        onClick={() => onCardSelect?.(!isSelected)}
      >
        {isSelected ? (
          <div className={css.triangle}>
            <Icon name="tick" size={14} className={css.tick} color={Color.WHITE} />
          </div>
        ) : null}

        <CardBody.Icon
          className={cx(css.cardIcon, { [css.cardIconSelected]: isSelected })}
          icon={iconProps.name}
          iconSize={iconProps.size}
          {...iconProps}
        />
        {!renderLabelOutsideCard && Boolean(cardLabel) && (
          <Text color={Color.BLACK} className={css.cardLabel}>
            {cardLabel}
          </Text>
        )}
      </Card>
      {renderLabelOutsideCard && Boolean(cardLabel) && (
        <Text color={Color.BLACK} className={css.cardLabel}>
          {cardLabel}
        </Text>
      )}
    </Layout.Vertical>
  )
}

export function CVSelectionCardGroup(props: CVSelectionCardGroupProps): JSX.Element {
  const { cards, defaultSelectedCardIndex, className } = props
  const [selectedCardIndex, setSelectedCardIndex] = useState(defaultSelectedCardIndex || -1)
  return (
    <Container className={className}>
      {cards?.map((cardProps, index) => (
        <CVSelectionCard
          {...cardProps}
          key={index}
          isSelected={index === selectedCardIndex}
          onCardSelect={isSelected => {
            setSelectedCardIndex(isSelected ? index : -1)
            cardProps.onCardSelect?.(isSelected)
          }}
        />
      ))}
    </Container>
  )
}
