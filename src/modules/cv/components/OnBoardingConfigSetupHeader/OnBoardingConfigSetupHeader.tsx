import React from 'react'
import { Container, Heading, Icon, Color, HarnessIcons } from '@wings-software/uikit'

import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import css from './OnBoardingConfigSetupHeader.module.scss'

interface OnBoardingConfigSetupHeaderProps {
  pageHeading?: string | JSX.Element
  iconProps: Omit<IconProps, 'className'>
  iconClassName?: string
}

export default function OnBoardingConfigSetupHeader(props: OnBoardingConfigSetupHeaderProps): JSX.Element {
  const { iconProps, pageHeading, iconClassName } = props
  const HarnessLogo = HarnessIcons['harness-logo-black']

  return (
    <Container className={css.main}>
      <Container className={css.iconContainer}>
        <HarnessLogo height={25} />
        <Icon name="plus" className={css.plusIcon} size={10} />
        <Icon size={30} className={iconClassName} {...iconProps} />
      </Container>
      <Heading level={2} color={Color.BLACK} font={{ size: 'small' }}>
        {pageHeading}
      </Heading>
    </Container>
  )
}
