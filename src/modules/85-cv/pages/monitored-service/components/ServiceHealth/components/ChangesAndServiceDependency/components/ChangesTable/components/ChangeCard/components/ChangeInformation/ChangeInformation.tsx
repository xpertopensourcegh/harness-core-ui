import React from 'react'
import cx from 'classnames'
import { Text, Container, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { getOnClickOptions } from '../ChangeDetails/ChangeDetails.utils'
import css from './ChangeInformation.module.scss'

interface ChangeInfoData {
  triggerAt: string
  summary: {
    priority: string
    assignee: { name: string; url?: string }
    urgency: string
    policy: { name: string; url?: string }
  }
}

export default function ChangeInformation({ infoData }: { infoData: ChangeInfoData }): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container>
      <Text font={{ size: 'medium', weight: 'bold' }} color={Color.GREY_800}>
        {getString('cv.changeSource.changeSourceCard.information')}
      </Text>
      <Container className={css.infoContainer}>
        <Text className={css.timeLabel} icon={'time'} iconProps={{ size: 13 }} font={{ size: 'small' }}>
          {`${getString('cv.changeSource.changeSourceCard.triggred')} ${infoData.triggerAt}`}
        </Text>
        <Text className={css.summaryTitle}>{'Summary'}</Text>
        <div className={css.summaryTable}>
          {Object.entries(infoData.summary).map(item => {
            const itemHasURL = typeof item[1] !== 'string' ? !!item[1]?.url : false
            return (
              <div key={item[0]} className={cx(css.summaryRow)}>
                <Container className={css.summaryCell}>
                  <Text className={cx(css.summaryKey)}>{item[0]}</Text>
                </Container>
                <Container className={css.summaryCell}>
                  <Text
                    className={cx(css.summaryValue, itemHasURL && css.isLink)}
                    {...(typeof item[1] !== 'string' ? getOnClickOptions(item[1]) : {})}
                  >
                    {typeof item[1] === 'string' ? item[1] : item[1]?.name}
                  </Text>
                </Container>
              </div>
            )
          })}
        </div>
      </Container>
    </Container>
  )
}
