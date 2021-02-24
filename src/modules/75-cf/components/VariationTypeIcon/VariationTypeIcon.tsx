import React from 'react'
import { CFVariationColors } from '@cf/constants'

export const VariationTypeIcon = ({ style, multivariate }: { style?: React.CSSProperties; multivariate: boolean }) => {
  return (
    <span style={{ display: 'inline-block', ...style }}>
      <span
        style={{
          borderRadius: '50%',
          width: 12,
          height: 12,
          backgroundColor: CFVariationColors[0],
          display: 'inline-block'
        }}
      ></span>
      <span
        style={{
          borderRadius: '50%',
          width: 12,
          height: 12,
          backgroundColor: CFVariationColors[1],
          display: 'inline-block',
          transform: 'translateX(-4px)',
          marginRight: '2px'
        }}
      ></span>
      {multivariate && (
        <>
          <span
            style={{
              borderRadius: '50%',
              width: 12,
              height: 12,
              backgroundColor: CFVariationColors[2],
              display: 'inline-block',
              transform: 'translateX(-10px)',
              marginRight: '-4px'
            }}
          ></span>
        </>
      )}
    </span>
  )
}
