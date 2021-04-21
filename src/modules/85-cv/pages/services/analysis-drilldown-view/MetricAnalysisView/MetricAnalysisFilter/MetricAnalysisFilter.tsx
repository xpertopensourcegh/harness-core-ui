import React, { useState } from 'react'
import { Container, Text, Select, Color, SelectOption, SelectProps } from '@wings-software/uicore'
import cx from 'classnames'
import { debounce } from 'lodash-es'
import { useStrings, UseStringsReturn } from 'framework/strings'
import css from './MetricAnalysisFilter.module.scss'

export const MetricAnalysisFilterType = {
  ANOMALOUS: 'ANOMALOUS',
  ALL_METRICS: 'ALL_METRICS'
}

export function getFilterOptions(getString: UseStringsReturn['getString']): SelectOption[] {
  return [
    {
      label: getString('cv.anomalousMetrics'),
      value: MetricAnalysisFilterType.ANOMALOUS
    },
    {
      label: getString('cv.allMetrics'),
      value: MetricAnalysisFilterType.ALL_METRICS
    }
  ]
}

interface MetricAnalysisFilterProps {
  onChangeFilter?: (updatedOption: string) => void
  defaultFilterValue?: SelectOption
  onFilterDebounceTime?: number
  onFilter?: (filterValue: string) => void
  className?: string
}

export function MetricAnalysisFilter(props: MetricAnalysisFilterProps): JSX.Element {
  const { onChangeFilter, defaultFilterValue, onFilter, onFilterDebounceTime, className } = props
  const { getString } = useStrings()
  const filterOptions = getFilterOptions(getString)
  const [selectedOption, setSelectedOption] = useState(defaultFilterValue || filterOptions[0])
  const [, setDebouncedFunc] = useState<typeof debounce | undefined>()
  const [filterValue, setFilterValue] = useState<string | undefined>()
  return (
    <Container className={cx(css.main, className)}>
      <Container className={css.filterOptionContainer}>
        <Text color={Color.BLACK} font={{ size: 'small' }}>
          {getString('cv.filter')}
        </Text>
        <Select
          items={filterOptions}
          value={selectedOption}
          className={css.filterByOptions}
          onChange={(selectedItem: SelectOption) => {
            if (selectedItem?.value !== selectedOption?.value) {
              setSelectedOption(selectedItem)
              onChangeFilter?.(selectedItem.value as string)
            }
          }}
          size={'small' as SelectProps['size']}
        />
      </Container>
      <input
        className={css.filterInput}
        placeholder={getString('search')}
        value={filterValue}
        onChange={e => {
          e.persist()
          setFilterValue(e.target.value)
          setDebouncedFunc((prevDebounce?: any) => {
            prevDebounce?.cancel()
            if (!onFilter) return
            const debouncedFunc = debounce(onFilter, onFilterDebounceTime || 500)
            debouncedFunc(e.target.value)
            return debouncedFunc as any
          })
        }}
      />
    </Container>
  )
}
