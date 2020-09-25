import { pluralize } from 'modules/common/utils/StringUtils'

export default {
  connector: 'Connector',
  details: 'Details',
  lastActivity: 'last activity',
  status: 'status',
  confirmDelete: (name: string) => `Are you sure you want to delete the Connector '${name}'?`,
  confirmDeleteTitle: 'Delete Connector',
  deleteButton: 'Delete',
  cancelButton: 'Cancel',
  success: 'active',
  failed: 'error',
  TEST_CONNECTION: 'TEST CONNECTION',
  TestInProgress: 'Test in progress',
  STEPS: {
    ONE: {
      PROGRESS: 'Checking Delegate',
      FAILED: 'Delegate not found',
      SUCCESS: 'Delegate found'
    },
    TWO: 'Establishing Connection',
    THREE: 'Verifying Connection'
  },
  delegateFound: (count: number | undefined) => `${count ? count : 'No'} delegate${pluralize(count || 0)} found`
}
