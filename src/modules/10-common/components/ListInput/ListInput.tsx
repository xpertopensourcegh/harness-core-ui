/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { defaultTo, map } from 'lodash-es'
import { FieldArray } from 'formik'
import type { IconProps } from '@harness/uicore/dist/icons/Icon'
import { Button, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'

export interface ListInputProps {
  name: string
  elementList: string[]
  readOnly?: boolean
  defaultValueToReset?: string[]
  addBtnLabel?: string
  deleteIconProps?: IconProps
  deleteBtnClassName?: string
  addBtnClassName?: string
  listItemRenderer(value: string, index: number): React.ReactNode
}

export function ListInput(props: ListInputProps) {
  const { name, elementList, readOnly, deleteIconProps, deleteBtnClassName, addBtnClassName, listItemRenderer } = props
  const { getString } = useStrings()
  const addBtnLabel = defaultTo(props.addBtnLabel, getString('plusAdd'))

  return (
    <FieldArray
      name={name}
      render={({ push, remove }) => (
        <>
          {map(elementList, (value: string, index: number) => (
            <Layout.Horizontal
              key={index}
              flex={{ alignItems: 'center' }}
              spacing="small"
              padding={{ bottom: 'small' }}
            >
              {listItemRenderer(value, index)}
              <Button
                icon="main-trash"
                iconProps={{ ...deleteIconProps, size: 22 }}
                minimal
                onClick={() => remove(index)}
                data-testid={`remove-${name}-[${index}]`}
                disabled={readOnly}
                className={deleteBtnClassName}
              />
            </Layout.Horizontal>
          ))}
          <Button
            intent="primary"
            minimal
            text={addBtnLabel}
            data-testid={`add-${name}`}
            onClick={() => push('')}
            disabled={readOnly}
            style={{ padding: 0 }}
            className={addBtnClassName}
          />
        </>
      )}
    />
  )
}