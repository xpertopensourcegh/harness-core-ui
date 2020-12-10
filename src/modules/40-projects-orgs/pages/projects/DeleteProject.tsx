import { useToaster } from '@common/components/Toaster/useToaster'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'
import { Project, useDeleteProject } from 'services/cd-ng'

import i18n from './DeleteProject.i18n'

const useDeleteProjectDialog = (data: Project, onSuccess: () => void) => {
  const { mutate: deleteProject } = useDeleteProject({
    queryParams: {
      accountIdentifier: data.accountIdentifier || '',
      orgIdentifier: data.orgIdentifier || /* istanbul ignore next */ ''
    }
  })
  const { showSuccess, showError } = useToaster()
  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || /* istanbul ignore next */ ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.delete,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteProject(data.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted) showSuccess(i18n.successMessage(data.name || /* istanbul ignore next */ ''))
          onSuccess()
        } catch (err) {
          /* istanbul ignore next */
          showError(err)
        }
      }
    }
  })
  return openDialog
}

export default useDeleteProjectDialog
