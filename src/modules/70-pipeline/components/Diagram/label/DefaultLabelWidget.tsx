/*
 * Copyright 2020 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import type { DefaultLabelModel } from './DefaultLabelModel'

export interface DefaultLabelWidgetProps {
  model: DefaultLabelModel
}

export function DefaultLabelWidget(props: DefaultLabelWidgetProps): JSX.Element {
  return <div>{props.model.getOptions().label}</div>
}
