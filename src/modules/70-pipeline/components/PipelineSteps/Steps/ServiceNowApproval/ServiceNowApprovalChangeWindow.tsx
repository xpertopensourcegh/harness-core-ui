/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { Color } from '@harness/design-system'
import { FormInput, Layout, SelectOption, Text } from '@harness/uicore'
import type { FormikContextType } from 'formik'
import React, { useMemo } from 'react'
import type { GetDataError } from 'restful-react'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { useStrings } from 'framework/strings'
import type { Failure, ServiceNowFieldNG } from 'services/cd-ng'
import type { ServiceNowApprovalData } from './types'
import css from '../Common/ApprovalRejectionCriteria.module.scss'

interface ServiceNowApprovalChangeWindowProps {
  formik: FormikContextType<ServiceNowApprovalData>
  readonly: boolean
  serviceNowIssueCreateMetadataFields: ServiceNowFieldNG[]
  fetchingServiceNowMetadata: boolean
  serviceNowMetadataFetchError: GetDataError<Error | Failure> | null | undefined
}

export const getDateTimeOptions = (serviceNowIssueCreateMetadataFields: ServiceNowFieldNG[]) => {
  const dateTimeSelectOptions: SelectOption[] = []
  serviceNowIssueCreateMetadataFields?.forEach(field => {
    if (field.schema.type === 'glide_date_time') {
      dateTimeSelectOptions.push({ label: field.name, value: field.key })
    }
  })

  return dateTimeSelectOptions
}

export function ServiceNowApprovalChangeWindow({
  formik,
  readonly,
  serviceNowIssueCreateMetadataFields,
  fetchingServiceNowMetadata,
  serviceNowMetadataFetchError
}: ServiceNowApprovalChangeWindowProps): React.ReactElement {
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()

  const selectOptions = useMemo(() => {
    return getDateTimeOptions(serviceNowIssueCreateMetadataFields)
  }, [serviceNowIssueCreateMetadataFields])

  const commonMultiTypeInputProps = (placeholder: string) => ({
    disabled: !formik.values?.spec.enableChangeWindow || readonly,
    selectItems: selectOptions,
    placeholder: fetchingServiceNowMetadata
      ? getString('pipeline.serviceNowApprovalStep.fetching')
      : serviceNowMetadataFetchError?.message || `${getString('select')} ${placeholder}`,
    useValue: true,
    multiTypeInputProps: {
      selectProps: {
        addClearBtn: true,
        items: selectOptions
      },
      expressions
    }
  })

  return (
    <div className={css.approvalChangeWindow}>
      <Text color={Color.GREY_800} font={{ weight: 'semi-bold', size: 'normal' }}>
        {getString('pipeline.serviceNowApprovalStep.approvalChangeWindow')}
      </Text>

      <Layout.Vertical spacing="medium" className={css.windowSelection}>
        <FormInput.CheckBox
          disabled={readonly}
          name="spec.enableChangeWindow"
          label={getString('enable')}
          tooltipProps={{
            dataTooltipId: 'serviceNowApprovalEnableChangeWindow'
          }}
        />
        <Layout.Horizontal spacing="medium">
          <FormInput.MultiTypeInput
            name="spec.changeWindow.startField"
            label={getString('pipeline.serviceNowApprovalStep.windowStart')}
            {...commonMultiTypeInputProps(getString('pipeline.serviceNowApprovalStep.windowStart'))}
          />
          <FormInput.MultiTypeInput
            name="spec.changeWindow.endField"
            label={getString('pipeline.serviceNowApprovalStep.windowEnd')}
            {...commonMultiTypeInputProps(getString('pipeline.serviceNowApprovalStep.windowEnd'))}
          />
        </Layout.Horizontal>
      </Layout.Vertical>
    </div>
  )
}
