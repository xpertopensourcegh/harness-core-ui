import React from 'react'
import { Container } from '@wings-software/uicore'
import css from './ItemContainer.module.scss'

export interface ItemContainerProps extends React.ComponentProps<typeof Container> {
  clickable?: boolean
}

const ClickableProps = { role: 'button', tabIndex: 0, className: css.withHover }

export const ItemContainer: React.FC<ItemContainerProps> = ({ style, children, clickable, ...props }) => {
  return (
    <Container
      {...(clickable ? ClickableProps : undefined)}
      padding="medium"
      style={{
        boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)',
        borderRadius: '8px',
        background: 'var(--white)',
        paddingLeft: 'var(--spacing-medium)',
        ...style
      }}
      {...props}
    >
      {children}
    </Container>
  )
}
