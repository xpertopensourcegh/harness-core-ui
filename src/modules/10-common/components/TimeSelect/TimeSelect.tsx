import React from 'react'
import { Layout, SelectOption, Text, Container, Select } from '@wings-software/uicore'
import { zeroFiftyNineDDOptions, amPmOptions, oneTwelveDDOptions } from './TimeSelectUtils'
import css from './TimeSelect.module.scss'

interface TimeSelectPropsInterface {
  label?: string
  handleHoursSelect: (option: SelectOption) => void
  handleMinutesSelect: (option: SelectOption) => void
  handleSecondsSelect?: (option: SelectOption) => void
  handleAmPmSelect: (option: SelectOption) => void
  hoursValue: SelectOption
  minutesValue: SelectOption
  secondsValue?: SelectOption
  amPmValue: SelectOption
  disabled?: boolean
  className?: string
  hideSeconds?: boolean
}

const TimeSelect: React.FC<TimeSelectPropsInterface> = props => {
  const {
    label,
    className,
    hoursValue,
    minutesValue,
    secondsValue,
    amPmValue,
    handleHoursSelect,
    handleMinutesSelect,
    handleSecondsSelect,
    handleAmPmSelect,
    hideSeconds,
    disabled
  } = props

  return (
    <Container className={className ? className : ''}>
      {label && <Text className={css.label}>{label}</Text>}
      <Layout.Horizontal spacing="xsmall">
        <Select
          className={css.selectStyle}
          value={hoursValue}
          items={oneTwelveDDOptions}
          onChange={handleHoursSelect}
          disabled={disabled}
        />
        <Select
          className={css.selectStyle}
          value={minutesValue}
          items={zeroFiftyNineDDOptions}
          onChange={handleMinutesSelect}
          disabled={disabled}
        />
        {!hideSeconds && (
          <Select
            className={css.selectStyle}
            value={secondsValue}
            items={zeroFiftyNineDDOptions}
            onChange={handleSecondsSelect}
            disabled={disabled}
          />
        )}
        <Select
          className={css.selectStyle}
          value={amPmValue}
          items={amPmOptions}
          onChange={handleAmPmSelect}
          disabled={disabled}
        />
      </Layout.Horizontal>
    </Container>
  )
}
export default TimeSelect
