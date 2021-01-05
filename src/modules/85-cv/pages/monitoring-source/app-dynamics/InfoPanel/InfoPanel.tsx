import React from 'react'
import { Container, Text, Color } from '@wings-software/uicore'
import styles from './InfoPanel.module.scss'

export interface InfoPanelItemProps {
  label: React.ReactNode
  text: React.ReactNode
}

export function InfoPanel({ children }: { children: Array<React.ReactNode> | React.ReactNode }) {
  return <Container className={styles.infoPanel}>{children}</Container>
}

export function InfoPanelItem({ label, text }: InfoPanelItemProps) {
  return (
    <Container className={styles.infoPanelItem}>
      <Text
        icon="info"
        iconProps={{
          color: Color.BLUE_500,
          margin: { right: 'medium' }
        }}
        font={{ weight: 'bold' }}
        margin={{ bottom: 'small' }}
      >
        {label}
      </Text>
      <Text>{text}</Text>
    </Container>
  )
}
