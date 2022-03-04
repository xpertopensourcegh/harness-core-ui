/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'

import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'

export enum EvaluationStatus {
  ERROR = 'error',
  PASS = 'pass',
  WARNING = 'warning'
}

function EvaluationStatusLabel({ status }: { status: EvaluationStatus }) {
  return (
    <ExecutionStatusLabel
      status={
        status === EvaluationStatus.PASS
          ? 'Success'
          : status === EvaluationStatus.ERROR
          ? 'Errored'
          : status === EvaluationStatus.WARNING
          ? 'InterventionWaiting'
          : undefined
      }
      label={status === EvaluationStatus.WARNING ? 'WARNING' : ''}
    />
  )
}

export default EvaluationStatusLabel
