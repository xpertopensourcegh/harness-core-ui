import React from 'react'
import { Container, Heading, Icon, Color } from '@wings-software/uikit'

import cx from 'classnames'
import type { IconProps } from '@wings-software/uikit/dist/icons/Icon'
import css from './OnBoardingConfigSetupHeader.module.scss'

interface OnBoardingConfigSetupHeaderProps {
  pageHeading?: string | JSX.Element
  iconProps: Omit<IconProps, 'className'>
  iconClassName?: string
}

export default function OnBoardingConfigSetupHeader(props: OnBoardingConfigSetupHeaderProps): JSX.Element {
  const { iconProps, pageHeading, iconClassName } = props
  return (
    <Container className={css.main}>
      <Container className={cx(css.iconContainer, iconClassName)}>
        <Icon size={45} className={css.dataSourceIcon} {...iconProps} />
      </Container>
      <Heading level={2} color={Color.BLACK} font={{ size: 'small' }}>
        {pageHeading}
      </Heading>
    </Container>
  )
}
