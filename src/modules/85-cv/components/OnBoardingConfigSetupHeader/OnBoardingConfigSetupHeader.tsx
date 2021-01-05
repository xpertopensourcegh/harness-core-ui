import React from 'react'
import { Container, Heading, Icon, HarnessIcons } from '@wings-software/uicore'

import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'
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
        <HarnessLogo height={19} />
        <Icon name="plus" className={css.plusIcon} size={10} />
        <Icon size={22} className={iconClassName} {...iconProps} />
      </Container>
      <Heading level={2} font={{ size: 'small' }}>
        {pageHeading}
      </Heading>
    </Container>
  )
}
