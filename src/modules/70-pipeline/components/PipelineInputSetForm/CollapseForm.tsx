import React from 'react'
import { Layout, Icon, Text } from '@wings-software/uikit'
import type { TextProps } from '@wings-software/uikit/dist/components/Text/Text'

export const CollapseForm: React.FC<{
  header: string
  children: React.ReactNode
  headerProps?: TextProps
  headerColor?: string
  open?: boolean
}> = ({
  header,
  children,
  headerProps = { font: { size: 'medium' } },
  headerColor = 'var(--pipeline-form-blue)',
  open = true
}): JSX.Element => {
  const [isOpen, setOpen] = React.useState(open)
  return (
    <div style={{ width: '100%' }}>
      <Layout.Horizontal
        flex={{ distribution: 'space-between' }}
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(prev => !prev)}
      >
        <Text {...headerProps} style={{ color: headerColor }}>
          {header}
        </Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} style={{ color: 'var(--pipeline-form-blue)' }} />
      </Layout.Horizontal>
      {isOpen && <Layout.Vertical padding={{ top: 'medium', bottom: 'medium' }}> {children}</Layout.Vertical>}
    </div>
  )
}
