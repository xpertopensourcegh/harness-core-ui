import * as utils from '../statusHelpers'

describe('statusHelpers tests', () => {
  describe('isExecutionComplete tests', () => {
    test.each<[utils.ExecutionStatus]>([['Aborted'], ['Expired'], ['Failed'], ['Success'], ['Suspended'], ['Error']])(
      'Status "%s" marks stage as complete',
      status => {
        expect(utils.isExecutionComplete(status)).toBe(true)
      }
    )
  })

  describe('isExecutionInProgress tests', () => {
    test.each<[utils.ExecutionStatus]>([['Paused'], ['Running'], ['Waiting'], ['Queued']])(
      'Status "%s" marks stage as in-progress',
      status => {
        expect(utils.isExecutionInProgress(status)).toBe(true)
      }
    )
  })
})
