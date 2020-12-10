import React from 'react'
import { Text, Layout, Button, Color, IconName } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { getIconBySourceType } from '../SetupUtils'
import css from './OnboardedSourceSummary.module.scss'

interface OnboardedSourceSummaryProps {
  sources: any[]
  title: string
  buttonText?: string
  iconSize?: number
  setShowSummary: (val: boolean) => void
}
const OnboardedSourceSummary: React.FC<OnboardedSourceSummaryProps> = props => {
  const history = useHistory()
  return (
    <Layout.Vertical>
      <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK}>
        {props.title}
      </Text>
      <div className={css.items}>
        {props.sources?.map((item, index) => {
          return (
            <div className={css.cardWrapper} key={`${item}${index}`} onClick={() => history.push(item.routeUrl)}>
              <CVSelectionCard
                isSelected={true}
                className={css.monitoringCard}
                iconProps={{
                  name: getIconBySourceType(item.type) as IconName,
                  size: props.iconSize || 40
                }}
                cardLabel={item.name}
                renderLabelOutsideCard={true}
              />
            </div>
          )
        })}
      </div>
      <Button
        intent="primary"
        width="fit-content"
        text={props.buttonText}
        onClick={() => {
          props.setShowSummary(false)
        }}
      />
    </Layout.Vertical>
  )
}

export default OnboardedSourceSummary
