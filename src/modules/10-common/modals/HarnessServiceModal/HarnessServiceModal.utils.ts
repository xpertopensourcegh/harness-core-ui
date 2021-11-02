export const getHarnessServiceModalFormDetails = (name?: string): { formName: string; field: string } => {
  return {
    formName: name ?? 'deployService',
    field: name ?? 'Service'
  }
}
