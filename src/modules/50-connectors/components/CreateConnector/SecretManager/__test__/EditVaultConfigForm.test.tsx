import React from 'react'
import { noop } from 'lodash-es'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { Connectors } from '@connectors/constants'
import EditVaultConfigForm from '../views/EditVaultConfigForm'

const dummyConnectorInfo = {
  name: 'sm14',
  identifier: 'sm14',
  description: 'asd',
  type: Connectors.Vault,
  spec: {
    vaultUrl: 'http://localhost:8200',
    renewIntervalHours: 0,
    secretEngineName: 'secret',
    secretEngineVersion: 2,
    default: false,
    readOnly: false
  }
}

describe('Edit Vault Config Form', () => {
  test('should render form', () => {
    const dom = render(
      <MemoryRouter>
        <EditVaultConfigForm
          type={Connectors.Vault}
          connector={dummyConnectorInfo}
          setConnector={noop}
          setConnectorForYaml={noop}
          onSubmit={noop}
        />
      </MemoryRouter>
    )

    expect(dom.container).toMatchSnapshot()
  })
})
