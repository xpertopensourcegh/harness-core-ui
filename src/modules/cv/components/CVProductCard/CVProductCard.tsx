import React, { useCallback } from 'react'
import { Card, CardBody, IconName, Container } from '@wings-software/uikit'
import css from './CVProductCard.module.scss'

export interface TypeCard {
  title: string
  icon: IconName
  iconSize?: number
}

interface CVProductCardProps {
  item: TypeCard
  onClick?: (item?: TypeCard) => void
  selected?: boolean
}

const CVProductCard: React.FC<CVProductCardProps> = (props: CVProductCardProps) => {
  const { onClick, selected, item } = props
  const onClickCallback = useCallback(() => onClick?.(item), [item, onClick])
  return (
    <Container className={css.main}>
      <Card interactive={true} className={css.cardStyles} onClick={onClickCallback} selected={selected}>
        <CardBody.Icon icon={item.icon} iconSize={props.item.iconSize || 30} className={css.icon} />
        <Container className={css.sourceText}>{item.title}</Container>
      </Card>
    </Container>
  )
}

export default CVProductCard
