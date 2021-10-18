import { CardSelect, CardSelectType, Color, Text } from '@wings-software/uicore'
import React from 'react'
import type { FilterCardProps } from './FilterCard.types'
import css from './FilterCard.module.scss'

const FilterCard: React.FC<FilterCardProps> = ({ data, cardClassName, selected, onChange }) => {
  return (
    <CardSelect
      type={CardSelectType.CardView}
      data={data}
      cardClassName={cardClassName}
      renderItem={({ title, icon, iconSize = 24, count }) => (
        <>
          <Text
            color={Color.GREY_900}
            font={{ size: 'small', weight: 'semi-bold' }}
            rightIcon={icon}
            rightIconProps={{ color: Color.GREY_700, size: iconSize }}
            className={css.lineHeight}
          >
            {title}
          </Text>
          <Text color={Color.BLACK} font={{ size: 'large', weight: 'bold' }} className={css.lineHeight}>
            {count}
          </Text>
        </>
      )}
      selected={selected}
      onChange={onChange}
    />
  )
}

export default FilterCard
