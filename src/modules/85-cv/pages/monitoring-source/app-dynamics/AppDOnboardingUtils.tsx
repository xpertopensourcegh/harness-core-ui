import React, { useState } from 'react'
import { Text, Color } from '@wings-software/uicore'
import type { MetricPackDTO } from 'services/cv'

export enum ValidationStatus {
  IN_PROGRESS = 'in-progress',
  NO_DATA = 'no-data',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface TierRecord {
  name: string
  service?: string
  validationStatus?: ValidationStatus
  validationResult?: any
}

export interface ApplicationRecord {
  name: string
  environment?: string
  totalTiers?: number
  tiers?: { [tierName: string]: TierRecord }
  metricPacks?: MetricPackDTO[]
}

export interface InternalState {
  [appName: string]: ApplicationRecord | undefined
}

export function useValidationErrors() {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const setError = (name: string, value?: string) => {
    setErrors(old => {
      const update = {
        ...old,
        [name]: value
      }
      if (!value) {
        delete update[name]
      }
      return update
    })
  }
  const hasError = (name: string) => !!errors[name]
  const renderError = (name: string) => errors[name] && <Text color={Color.RED_500}>{errors[name]}</Text>

  return { errors, setError, renderError, hasError }
}
