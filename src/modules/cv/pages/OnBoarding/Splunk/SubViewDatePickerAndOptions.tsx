import React, { useCallback, useContext, useMemo, useState, CSSProperties } from 'react'
import moment from 'moment'
import {
  Layout,
  Button,
  Container,
  SelectWithSubviewContext,
  SelectWithSubview,
  SelectOption
} from '@wings-software/uikit'
import { DateRangePicker, DateRange, IDateRangePickerProps } from '@blueprintjs/datetime'

const ExampleItems: SelectOption[] = [
  { value: `${new Date().getTime()},${new Date().getTime() - 30000}`, label: 'Past 30 minutes' },
  { value: `${new Date().getTime()},${new Date().getTime() - 60000}`, label: 'Past 1 hour' }
]

interface DatePickerSubviewProps extends IDateRangePickerProps {
  onSelectRange: (range: SelectOption, dateRange: DateRange) => void
}

const mainStyle: CSSProperties = {
  border: '1px solid var(--grey-400)',
  borderTop: 'none',
  borderBottomRightRadius: '5px',
  borderBottomLeftRadius: '5px'
}

function DatePickerSubview(props: DatePickerSubviewProps) {
  const { toggleSubview } = useContext(SelectWithSubviewContext)
  const { onSelectRange, ...bpDatePickerProps } = props
  const [selectedDateRange, setDateRange] = useState<DateRange>()
  const onCancelCallback = useCallback(
    () => () => {
      toggleSubview()
    },
    [toggleSubview]
  )
  const onSelectRangeCallback = useCallback(
    () => () => {
      if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
        const [startTime, endTime] = [selectedDateRange[0].getTime(), selectedDateRange[1].getTime()]
        const val = {
          label: `From ${moment(startTime).format('MMMM Do')} - ${moment(endTime).format('MMMM Do')}`,
          value: endTime - startTime
        }
        toggleSubview(val)
        if (onSelectRange) {
          onSelectRange(val, selectedDateRange)
        }
      }
    },
    [toggleSubview, onSelectRange, selectedDateRange]
  )
  const minDate = useMemo(
    () =>
      moment()
        .subtract(30, 'days')
        .toDate(),
    []
  )
  const maxDate = useMemo(() => new Date(), [])
  return (
    <Layout.Vertical style={mainStyle}>
      <DateRangePicker
        minDate={minDate}
        maxDate={maxDate}
        singleMonthOnly={true}
        shortcuts={false}
        {...bpDatePickerProps}
        onChange={setDateRange}
      />
      <Container margin="medium" flex style={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancelCallback()} style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button onClick={onSelectRangeCallback()} intent="primary">
          Submit
        </Button>
      </Container>
    </Layout.Vertical>
  )
}

export default function SubViewDatePickerAndOptions(props: any) {
  return (
   
    <SelectWithSubview
      value={props.values?.selectedDate}
      items={ExampleItems}
      renderSubviewWithoutMenuStyling={true}
      changeViewButtonLabel="Custom Date"
      onChange={value => {
        props.parentFormikProps.setFieldValue(`queries[${props.index}].baselineTime`, value)
      }}
      subview={
        <DatePickerSubview
          onSelectRange={(_range: SelectOption, obj) => {
            props.parentFormikProps.setFieldValue(`queries[${props.index}].baselineTime`, obj)
          }}
        />
      }
    />
    
  )
}
