/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FC, useMemo } from 'react'
import { FormInput, SelectOption } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import type { TargetGroupFlag } from './FlagSettingsPanel.types'

export interface VariationsCellProps {
  flag: TargetGroupFlag
  fieldPrefix: string
}

const VariationsCell: FC<VariationsCellProps> = ({ flag, fieldPrefix }) => {
  const { getString } = useStrings()
  const { variations } = flag.flag

  const flagItems = useMemo<SelectOption[]>(
    () =>
      variations.map<SelectOption>(({ identifier, name }) => ({
        label: name || identifier,
        value: identifier
      })),
    [variations]
  )

  return (
    <FormInput.Select
      placeholder={getString('cf.segmentDetail.selectVariation')}
      name={`${fieldPrefix}.variation`}
      items={flagItems}
      style={{ margin: 0 }}
    />
  )
}

export default VariationsCell
