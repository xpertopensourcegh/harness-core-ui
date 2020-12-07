import React, { useState } from 'react'
import { Text, Color } from '@wings-software/uikit'

export enum ValidationStatus {
  IN_PROGRESS = 'in-progress',
  NO_DATA = 'no-data',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface TierRecord {
  id: number
  name: string
  appId: number
  service?: string
  validationStatus?: ValidationStatus
  metricData?: any
  totalTiers?: number
}

export interface ApplicationRecord {
  id: number
  name: string
  environment?: string
}

export function useValidationErrors() {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const setError = (name: string, value?: string) => {
    setErrors(old => ({
      ...old,
      [name]: value
    }))
  }
  const renderError = (name: string) => errors[name] && <Text color={Color.RED_500}>{errors[name]}</Text>

  return { errors, setError, renderError }
}
