import { ButtonProps, Button, Color, Heading, Container, Icon, Layout, IconName } from '@wings-software/uicore'
import React from 'react'

export interface NoDataCardProps {
  icon: IconName
  iconSize?: number
  message: string
  width?: number
  buttonText?: string
  buttonWidth?: number
  onClick?: ButtonProps['onClick']
  className?: string
}

export const NoDataCard: React.FC<NoDataCardProps> = props => (
  <Container width="100%" height="100%" flex={{ align: 'center-center' }}>
    <Layout.Vertical
      spacing="medium"
      width={props?.width || 470}
      style={{ alignItems: 'center', marginTop: '-48px' }}
      className={props.className}
    >
      <Icon name={props.icon} size={props.iconSize || 48} color={Color.GREY_400} />
      <Heading level={2} font={{ align: 'center' }} color={Color.GREY_500}>
        {props.message}
      </Heading>
      {props.buttonText ? (
        <Button intent="primary" text={props.buttonText} width={props.buttonWidth} onClick={props.onClick} />
      ) : null}
    </Layout.Vertical>
  </Container>
)
