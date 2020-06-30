import React from 'react'
import { IconName, Container, Text, Heading, Icon, Color } from '@wings-software/uikit'
import css from './OnBoardingConfigSetupHeader.module.scss'

interface OnBoardingConfigSetupHeaderProps {
  iconName: IconName
  iconSubText?: string | JSX.Element
  pageHeading?: string | JSX.Element
}

export default function OnBoardingConfigSetupHeader(props: OnBoardingConfigSetupHeaderProps): JSX.Element {
  const { iconName, iconSubText, pageHeading } = props
  return (
    <Container className={css.main}>
      <Container className={css.iconContainer}>
        <Icon name={iconName} size={45} className={css.dataSourceIcon} />
        <Text style={{ textAlign: 'center', fontSize: '10px' }} color={Color.BLACK}>
          {iconSubText}
        </Text>
      </Container>
      <Heading level={2} color={Color.BLACK}>
        {pageHeading}
      </Heading>
    </Container>
  )
}
