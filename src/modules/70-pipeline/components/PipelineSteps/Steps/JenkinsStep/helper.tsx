/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import type { SelectOption } from '@harness/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { noop } from 'lodash-es'
import type { UseStringsReturn } from 'framework/strings'
import type { JenkinsStepData } from './types'

export const resetForm = (
  formik: FormikProps<JenkinsStepData>,
  parent: string,
  prefix: string,
  updateJobName?: boolean
): void => {
  if (parent === 'connectorRef') {
    if (updateJobName) {
      formik.setFieldValue(`${prefix}spec.jobName`, '')
    }
    formik.setFieldValue(`${prefix}spec.jobParameter`, [])
  }
  if (parent === 'jobName') {
    formik.setFieldValue(`${prefix}spec.jobParameter`, [])
  }
}

export const scriptInputType: SelectOption[] = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' }
]

export const variableSchema = (
  getString: UseStringsReturn['getString']
): Yup.NotRequiredArraySchema<
  | {
      name: string
      value: string
      type: string
    }
  | undefined
> =>
  Yup.array().of(
    Yup.object({
      name: Yup.string().required(getString('common.validation.nameIsRequired')),
      value: Yup.string().required(getString('common.validation.valueIsRequired')),
      type: Yup.string().trim().required(getString('common.validation.typeIsRequired'))
    })
  )

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useGetJobParametersForJenkins = (_props: any) => {
  return {
    refetch: (_params: any) => noop,
    data: {
      status: 'SUCCESS',
      data: [
        {
          name: 'booleankey',
          options: ['true', 'false'],
          defaultValue: 'true',
          description: ''
        },
        {
          name: 'name',
          options: [],
          defaultValue: 'test name',
          description: ''
        },
        { name: 'test', options: [], defaultValue: '123', description: '' }
      ],
      metaData: null,
      correlationId: 'ad95ea52-11ea-43a3-ba16-e5c3312e6cb0'
    }
  }
}