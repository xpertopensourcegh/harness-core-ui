import React from 'react'
import { Text, Color, Button, Layout, SelectOption } from '@wings-software/uikit'
import { useStrings } from 'framework/exports'
import { ServiceSelectOrCreate } from '@cv/components/ServiceSelectOrCreate/ServiceSelectOrCreate'
import { ValidationStatus, TierRecord } from '../AppDOnboardingUtils'

interface ValidationCellProps {
  tier?: TierRecord
  onValidateTier(): void
  onShowValidationResult(val: TierRecord['validationStatus']): void
}

interface ServiceCellProps {
  value?: string
  disabled?: boolean
  onSelect(value: string): void
  options: SelectOption[]
  onUpdateOptions(options: SelectOption[]): void
}

export const ValidationCell = ({ tier, onValidateTier, onShowValidationResult }: ValidationCellProps) => {
  const { getString } = useStrings()
  const additionalProps = tier?.validationResult
    ? {
        onClick: () => onShowValidationResult(tier?.validationResult),
        style: { cursor: 'pointer' }
      }
    : {}
  switch (tier?.validationStatus) {
    case ValidationStatus.IN_PROGRESS:
      return (
        <Text icon="steps-spinner" iconProps={{ size: 16 }}>
          {getString('cv.monitoringSources.appD.verificationsInProgress')}
        </Text>
      )
    case ValidationStatus.NO_DATA:
      return (
        <Text icon="issue" iconProps={{ size: 16 }} {...additionalProps}>
          {getString('cv.monitoringSources.appD.noData')}
        </Text>
      )
    case ValidationStatus.SUCCESS:
      return (
        <Text icon="tick" iconProps={{ size: 16, color: Color.GREEN_500 }} {...additionalProps}>
          {getString('cv.monitoringSources.appD.validationsPassed')}
        </Text>
      )
    case ValidationStatus.ERROR:
      return (
        <Layout.Horizontal spacing="small">
          <Text icon="warning-sign" iconProps={{ size: 16, color: Color.RED_500 }} {...additionalProps}>
            {getString('cv.monitoringSources.appD.validationsFailed')}
          </Text>
          <Button
            icon="refresh"
            iconProps={{ size: 12 }}
            color={Color.BLUE_500}
            text={getString('retry')}
            onClick={onValidateTier}
          />
        </Layout.Horizontal>
      )
    default:
      return null
  }
}

export const ServiceCell = ({ value, disabled, onSelect, options = [], onUpdateOptions }: ServiceCellProps) => {
  const selectedOption = options?.find((opt: any) => opt.value === value)
  return (
    <ServiceSelectOrCreate
      disabled={disabled}
      item={selectedOption}
      options={options}
      onNewCreated={service => {
        onSelect(service.name as string)
        onUpdateOptions([{ label: service.name!, value: service.name! }, ...options])
      }}
      onSelect={opt => {
        onSelect(opt.value as string)
      }}
    />
  )
}
