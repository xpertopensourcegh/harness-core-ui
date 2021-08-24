import React from 'react'
import type { FormikProps } from 'formik'
import { Color, Container } from '@wings-software/uicore'
import { NameIdDescriptionTags } from '@common/components'
import { useStrings } from 'framework/strings'
import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import css from './MonitoredServiceDetails.module.scss'

export default function MonitoredServiceDetails({ formik }: { formik: FormikProps<any> }): JSX.Element {
  const { getString } = useStrings()
  return (
    <CardWithOuterTitle
      title={getString('cv.monitoredServices.monitoredServiceDetails')}
      className={css.monitoredService}
    >
      <Container width={'400px'} color={Color.BLACK}>
        <NameIdDescriptionTags
          formikProps={formik}
          identifierProps={{
            isIdentifierEditable: !formik?.values?.isEdit,
            inputLabel: getString('cv.monitoredServices.monitoredServiceName')
          }}
        />
      </Container>
    </CardWithOuterTitle>
  )
}
