import { ButtonProps, Button, Color, Heading, Icon, Layout, IconName } from '@wings-software/uikit'
import React from 'react'

export interface NoDataCardProps {
  icon: IconName
  iconSize?: number
  message: string
  width?: number
  buttonText: string
  buttonWidth?: number
  onClick: ButtonProps['onClick']
  className?: string
}

export const NoDataCard: React.FC<NoDataCardProps> = props => {
  return (
    <Layout.Vertical
      spacing="medium"
      width={props?.width || 470}
      style={{ alignItems: 'center', marginTop: '-250px' }}
      className={props.className}
    >
      <Icon name={props.icon} size={props.iconSize || 100} color={Color.GREY_400} />
      <Heading level={2} font={{ align: 'center' }} color={Color.GREY_500}>
        {props.message}
      </Heading>
      <Button intent="primary" text={props.buttonText} width={props.buttonWidth} onClick={props.onClick} />
    </Layout.Vertical>
  )
}
