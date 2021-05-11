import React from 'react'
import { Select, SelectOption, Text, Container } from '@wings-software/uicore'
import styles from './RangeSelector.module.scss'

export const rangeOptions = [
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 60 days', value: 60 },
  { label: 'Last 7 days', value: 7 }
]

export interface RangeSelectorProps {
  defaultOption?: SelectOption
  onRangeSelected?(range: number[]): void
}

export interface RangeSelectorWithTitleProps extends RangeSelectorProps {
  title: React.ReactNode
}

export default function RangeSelector({ defaultOption = rangeOptions[0], onRangeSelected }: RangeSelectorProps) {
  return (
    <Select
      className={styles.rangeSelector}
      defaultSelectedItem={defaultOption}
      items={rangeOptions}
      onChange={option => {
        const now = Date.now()
        onRangeSelected?.([now - (option.value as number) * 24 * 60 * 60 * 1000, now])
      }}
    />
  )
}

export function RangeSelectorWithTitle({ defaultOption, onRangeSelected, title }: RangeSelectorWithTitleProps) {
  return (
    <Container className={styles.titleAndFilter}>
      <Text>{title}</Text>
      <RangeSelector defaultOption={defaultOption} onRangeSelected={onRangeSelected} />
    </Container>
  )
}
