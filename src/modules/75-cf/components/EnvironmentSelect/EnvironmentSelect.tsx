import React from 'react'
import { Layout, Select, SelectOption, Text } from '@wings-software/uicore'

export interface EnvironmentSelectProps {
  label: string
  selectedEnvironment?: SelectOption
  environments: SelectOption[]
  onChange: (opt: SelectOption) => void
}

export const EnvironmentSelect: React.FC<EnvironmentSelectProps> = ({
  label,
  selectedEnvironment,
  environments,
  onChange
}) => (
  <Layout.Horizontal flex={{ align: 'center-center' }}>
    <Text margin={{ right: 'small' }} font={{ weight: 'bold' }}>
      {label}
    </Text>
    <Select value={selectedEnvironment} items={environments} onChange={onChange} />
  </Layout.Horizontal>
)
