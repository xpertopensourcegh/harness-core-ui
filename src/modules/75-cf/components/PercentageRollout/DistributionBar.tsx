import React, { FC } from 'react'
import type { Variation } from 'services/cf'
import { CFVariationColors } from '@cf/constants'

import css from './DistributionBar.module.scss'

export interface DistributionSegment {
  variation: Variation
  weight: number
}

export interface DistributionBarProps {
  distributionSegments: DistributionSegment[]
}

const DistributionBar: FC<DistributionBarProps> = ({ distributionSegments }) => {
  const { parts: gradientParts, lastStop: endStop } = distributionSegments.reduce<{
    parts: string[]
    lastStop: number
  }>(
    ({ parts, lastStop }, distributionSegment, index) => {
      const color = CFVariationColors[index % CFVariationColors.length]
      const endPoint = lastStop + distributionSegment.weight

      parts.push(`${color} ${lastStop}%, ${color} ${endPoint}%`)

      return { parts, lastStop: endPoint }
    },
    {
      parts: [],
      lastStop: 0
    }
  )

  if (endStop < 100) {
    gradientParts.push(`rgba(0,0,0,0) ${endStop}%`)
  }

  return (
    <div
      className={css.distributionBar}
      style={
        endStop <= 100
          ? { backgroundImage: `linear-gradient(to right, ${gradientParts.join()})` }
          : { backgroundColor: 'var(--red-900)' }
      }
    />
  )
}

export default DistributionBar
