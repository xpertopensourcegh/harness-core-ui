export const cvDefaultFailureStrategies = [
  {
    onFailure: {
      errors: ['Verification'],
      action: {
        type: 'ManualIntervention',
        spec: {
          timeout: '2h',
          onTimeout: {
            action: {
              type: 'StageRollback'
            }
          }
        }
      }
    }
  },
  {
    onFailure: {
      errors: ['AnyOther'],
      action: {
        type: 'ManualIntervention',
        spec: {
          timeout: '2h',
          onTimeout: {
            action: {
              type: 'Ignore'
            }
          }
        }
      }
    }
  }
]
