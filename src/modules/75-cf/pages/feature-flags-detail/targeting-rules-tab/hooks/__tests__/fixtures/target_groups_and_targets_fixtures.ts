/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

const targetGroupsAddedFixture = {
  initialFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [],
      targetGroups: [
        {
          identifier: 'target_group_1',
          ruleId: 'a3840b52-2b76-45af-93da-2eec20e7299c',
          name: 'target_group_1'
        }
      ],
      isVisible: true
    }
  ],

  newFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [],
      targetGroups: [
        {
          identifier: 'target_group_1',
          ruleId: '',
          name: 'target_group_1'
        },
        {
          identifier: 'target_group_2',
          ruleId: '',
          name: 'target_group_2'
        },
        {
          identifier: 'target_group_3',
          ruleId: '',
          name: 'target_group_3'
        }
      ],
      isVisible: true
    }
  ],
  expected: {
    instructions: [
      {
        kind: 'addRule',
        parameters: {
          clauses: [{ op: 'segmentMatch', values: ['target_group_2'] }],
          priority: 100,
          serve: { variation: 'true' },
          uuid: 'UUID'
        }
      },
      {
        kind: 'addRule',
        parameters: {
          clauses: [{ op: 'segmentMatch', values: ['target_group_3'] }],
          priority: 100,
          serve: { variation: 'true' },
          uuid: expect.anything()
        }
      }
    ]
  }
}

const targetGroupsRemovedFixture = {
  initialFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [],
      targetGroups: [
        {
          identifier: 'target_group_1',
          ruleId: 'a3840b52-2b76-45af-93da-2eec20e7299c',
          name: 'target_group_1'
        },
        {
          identifier: 'target_group_2',
          ruleId: 'a3240b52-2b76-45af-93da-2eec20e33333',
          name: 'target_group_2'
        }
      ],
      isVisible: true
    }
  ],
  newFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [],
      targetGroups: [],
      isVisible: true
    }
  ],
  expected: {
    instructions: [
      { kind: 'removeRule', parameters: { ruleID: 'a3840b52-2b76-45af-93da-2eec20e7299c' } },
      { kind: 'removeRule', parameters: { ruleID: 'a3240b52-2b76-45af-93da-2eec20e33333' } }
    ]
  }
}

const targetAddedFixture = {
  initialFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [
        {
          identifier: 'target1',
          name: 'target_1'
        }
      ],
      targetGroups: [],
      isVisible: true
    }
  ],
  newFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [
        {
          identifier: 'target1',
          name: 'target_1'
        },
        {
          identifier: 'target2',
          name: 'target_2'
        }
      ],
      targetGroups: [],
      isVisible: true
    }
  ],
  expected: {
    instructions: [{ kind: 'addTargetsToVariationTargetMap', parameters: { targets: ['target2'], variation: 'true' } }]
  }
}

const targetRemovedFixture = {
  initialFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [
        {
          identifier: 'target1',
          name: 'target_1'
        },
        {
          identifier: 'target2',
          name: 'target_2'
        }
      ],
      targetGroups: [],
      isVisible: true
    }
  ],
  newFormVariationMap: [
    {
      variationIdentifier: 'true',
      variationName: 'True',
      targets: [
        {
          identifier: 'target2',
          name: 'target_2'
        }
      ],
      targetGroups: [],
      isVisible: true
    }
  ],
  expected: {
    instructions: [
      { kind: 'removeTargetsToVariationTargetMap', parameters: { targets: ['target1'], variation: 'true' } }
    ]
  }
}

export { targetGroupsAddedFixture, targetGroupsRemovedFixture, targetAddedFixture, targetRemovedFixture }
