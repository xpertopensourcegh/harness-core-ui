import React from 'react'

export const onNextMock = jest.fn()
const mockCVConnectorHoc = (input: any) => {
  const { ConnectorCredentialsStep } = input
  return function Wrapper(props: any) {
    return <ConnectorCredentialsStep {...props} nextStep={onNextMock} prevStepData={props.connectorInfo} />
  }
}

jest.mock('../CVConnectorHOC', () => ({
  ...(jest.requireActual('../CVConnectorHOC') as any),
  cvConnectorHOC: mockCVConnectorHoc
}))
