/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { noop } from 'lodash-es'
import type { ServiceResponseDTO } from 'services/cd-ng'

export interface ServiceContextValues {
  serviceResponse: ServiceResponseDTO
  onCloseModal: () => void
  isServiceEntityModalView: boolean
  isServiceEntityPage: boolean
}

export const ServiceContext = React.createContext<ServiceContextValues>({
  serviceResponse: {},
  onCloseModal: () => noop,
  isServiceEntityModalView: false,
  isServiceEntityPage: false
})

export interface ServiceContextProviderProps extends ServiceContextValues {
  children: React.ReactNode
}

export function ServiceContextProvider(props: ServiceContextProviderProps): React.ReactElement {
  const { children, ...rest } = props

  return <ServiceContext.Provider value={rest}>{children}</ServiceContext.Provider>
}

export function useServiceContext(): ServiceContextValues {
  return React.useContext(ServiceContext)
}