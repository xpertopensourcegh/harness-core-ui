import React, { useCallback } from 'react'
import { Card, Container, Icon, IconName, Text, Color } from '@wings-software/uikit'
import cx from 'classnames'
import css from './ActivityTypeCard.module.scss'

interface ActivityTypeCardProps {
  iconName: IconName
  activityType?: string
  activityName: string
  className?: string
  onClick?: (activityName: string) => void
}

export default function ActivityTypeCard(props: ActivityTypeCardProps): JSX.Element {
  const { iconName, activityType, activityName, className, onClick } = props
  const onCardClickCallback = useCallback(() => onClick?.(activityName), [activityName, onClick])
  return (
    <Card className={cx(css.main, className, onClick ? css.cursor : undefined)} onClick={onCardClickCallback}>
      <Container className={css.iconTitleContainer}>
        <Icon name={iconName} size={18} />
        <Text className={css.activityType} color={Color.GREY_250}>
          {activityType}
        </Text>
      </Container>
      <Text className={css.activityName} color={Color.GREY_250}>
        {activityName}
      </Text>
    </Card>
  )
}
