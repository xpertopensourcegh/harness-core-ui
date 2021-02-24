import { Text } from '@wings-software/uicore'
import React from 'react'
import type { Variation } from 'services/cf'
import { CFVariationColors } from '@cf/constants'

interface VariationWithIconProps {
  variation: Variation
  index: number
  iconStyle?: React.CSSProperties
  textElement?: React.ReactElement | string
  textStyle?: React.CSSProperties
}

export const VariationWithIcon: React.FC<VariationWithIconProps> = ({
  variation = {},
  index = 0,
  iconStyle,
  textElement,
  textStyle
}) => {
  const { name, value } = variation

  return (
    <>
      <span
        style={{
          borderRadius: '50%',
          width: 12,
          height: 12,
          backgroundColor: CFVariationColors[index % CFVariationColors.length],
          display: 'inline-block',
          ...iconStyle
        }}
      ></span>
      <Text inline margin={{ bottom: 'xsmall' }} style={{ marginBottom: 0, ...textStyle }}>
        {textElement || name || value}
      </Text>
    </>
  )
}
