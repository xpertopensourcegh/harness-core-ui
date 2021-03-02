import React from 'react'
import { Text, TextProps } from '@wings-software/uicore'

export interface IdentifierTextProps extends TextProps {
  identifier?: string
}

export const IdentifierText: React.FC<IdentifierTextProps> = ({ identifier, style, ...props }) => (
  <Text
    inline
    style={{
      backgroundColor: '#CDF4FE',
      marginBottom: 'var(--spacing-small)',
      padding: 'var(--spacing-xsmall) var(--spacing-small)',
      borderRadius: '2px',
      fontSize: '12px',
      lineHeight: '15px',
      color: '#22222A',
      ...style
    }}
    {...props}
  >
    {identifier}
  </Text>
)
