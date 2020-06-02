import React from 'react'
import { Card, CardBody } from '@wings-software/uikit'
import css from './CvCard.module.scss'

export interface TypeCard {
  title: string
  icon: string
}

interface CvCardProps {
  item: TypeCard
  onClick?: (value?: any) => void
  selected?: TypeCard
}

const CvCard = (props: CvCardProps) => {
  const getCard = (source: any) => {
    return (
      <Card
        interactive={true}
        className={css.cardStyles}
        onClick={() => {
          source.onClick(source.item)
        }}
        selected={source.selected?.icon === source.item.icon && source.selected?.title === source.item.title}
      >
        <CardBody.Icon icon={source.item.icon} iconSize={30} className={css.icon}></CardBody.Icon>
        <div className={css.sourceText}> {source.item.title} </div>
      </Card>
    )
  }

  return <div className={css.main}>{getCard(props)}</div>
}

export default CvCard
