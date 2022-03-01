/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { MultiTypeInputType } from '@harness/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import type { ManifestConfigWrapper, ServiceSpec } from 'services/cd-ng'
import { ManifestSourceBaseFactory } from '@cd/factory/ManifestSourceFactory/ManifestSourceBaseFactory'
import { KubernetesManifests } from '../KubernetesManifests'

import { template, manifests } from './mocks'

describe('Kubernetes sidecar artifacts tests', () => {
  test('Should match snapshot', () => {
    const { container } = render(
      <TestWrapper>
        <KubernetesManifests
          initialValues={{}}
          template={template as ServiceSpec}
          manifests={manifests as ManifestConfigWrapper[]}
          readonly
          stageIdentifier="stage-0"
          manifestSourceBaseFactory={new ManifestSourceBaseFactory()}
          allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME, MultiTypeInputType.EXPRESSION]}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
