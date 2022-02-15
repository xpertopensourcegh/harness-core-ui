/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { folderIdOrBlank } from '../CustomDashboardsService'

describe('CustomDashboardsService', () => {
  test('it should return blank when folderId is shared', async () => {
    const folderId = 'shared'

    const result = folderIdOrBlank(folderId)

    expect(result).toEqual('')
  })

  test('it should return the ID when folderId is a number', async () => {
    const folderId = '123'

    const result = folderIdOrBlank(folderId)

    expect(result).toEqual('123')
  })
})
