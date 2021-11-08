import type { FormikProps } from 'formik'
import type { UpdatedChangeSourceDTO } from '../../ChangeSourceDrawer.types'

export interface KubernetesChangeSourceProps {
  formik: FormikProps<UpdatedChangeSourceDTO>
  isEdit?: boolean
}
