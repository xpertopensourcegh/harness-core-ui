import React from 'react'
import { Select, Text, Color, Button, Layout, SelectOption } from '@wings-software/uikit'
import { useStrings } from 'framework/exports'
import { ValidationStatus, TierRecord } from '../AppDOnboardingUtils'

interface CellProps {
  tierId: number
  tierData?: TierRecord
  options?: Array<SelectOption>
  onValidateTier?(tierId: number): void
  onUpdate?(tierId: number, data: Partial<TierRecord> | null): void
}

export const SelectedCell = ({ tierId, tierData, onUpdate }: CellProps) => {
  const selected = !!tierData
  return (
    <input
      type="checkbox"
      className="select-tier"
      checked={selected}
      onChange={e => {
        const isChecked = e.target.checked
        onUpdate?.(
          tierId,
          isChecked
            ? {
                id: tierId
              }
            : null
        )
      }}
    />
  )
}

export const ValidationCell = ({
  tierId,
  tierData,
  onValidateTier,
  onShowValidationResult
}: CellProps & { onShowValidationResult(val: any): void }) => {
  const { getString } = useStrings()
  const additionalProps = tierData?.metricData
    ? {
        onClick: () => onShowValidationResult(tierData?.metricData),
        style: { cursor: 'pointer' }
      }
    : {}
  switch (tierData?.validationStatus) {
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
            onClick={() => {
              onValidateTier?.(tierId)
            }}
          />
        </Layout.Horizontal>
      )
    default:
      return null
  }
}

export const ServiceCell = ({ tierId, tierData, onUpdate, options, onValidateTier }: CellProps) => {
  const selectedOption = options?.find((opt: any) => opt.value === tierData?.service)
  return (
    <Select
      disabled={!tierData}
      value={selectedOption}
      items={options || []}
      inputProps={{ placeholder: 'select or create a service' }}
      onChange={opt => {
        onUpdate?.(tierId, { service: opt.value as string })
        onValidateTier?.(tierId)
      }}
    />
  )
}
