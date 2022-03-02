/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseTemplateMergeResponse, ResponseVariableMergeServiceResponse } from 'services/template-ng'
import { yamlStringify } from '@common/utils/YamlHelperMethods'
import template from './template.json'
import metaDataMap from './metaDataMap.json'
import variables from './variables.json'

export const MergedPipelineResponse: UseGetReturnData<ResponseTemplateMergeResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      mergedPipelineYaml: yamlStringify(template),
      templateReferenceSummaries: []
    },
    correlationId: 'f91a0aa2-d2b0-49c9-8a3e-a38bc128d644'
  }
}

export const CreateVariableResponse: UseGetReturnData<ResponseVariableMergeServiceResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      yaml: yamlStringify(variables),
      metadataMap: metaDataMap,
      errorResponses: [],
      serviceExpressionPropertiesList: []
    },
    correlationId: '4852cc30-0548-4ca7-b491-7cc1a6c8c780'
  }
}
