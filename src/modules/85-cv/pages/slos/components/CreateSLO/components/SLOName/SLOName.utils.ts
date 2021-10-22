import type { SelectOption } from '@wings-software/uicore'
import type { FormikProps } from 'formik'
import type { SLOForm } from '../../CreateSLO.types'

export function updateSLOForUserJourney(formik: FormikProps<SLOForm>, userJourney?: SelectOption): void {
  const { values } = formik || {}
  formik.setValues({
    ...values,
    userJourney: userJourney?.value as string
  })
}
