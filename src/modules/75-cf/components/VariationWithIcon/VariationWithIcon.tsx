import { Text } from '@wings-software/uicore'
import React from 'react'
import type { Variation } from 'services/cf'
import { CFVariationColors } from '@cf/constants'

export const VariationWithIcon: React.FC<{ variation: Variation; index: number }> = ({ variation = {}, index = 0 }) => {
  const { name, value } = variation

  return (
    <>
      <span
        style={{
          borderRadius: '50%',
          width: 12,
          height: 12,
          backgroundColor: CFVariationColors[index % CFVariationColors.length],
          display: 'inline-block'
        }}
      ></span>
      <Text inline margin={{ bottom: 'xsmall' }} style={{ marginBottom: 0 }}>
        {name || value}
      </Text>
    </>
  )
}
