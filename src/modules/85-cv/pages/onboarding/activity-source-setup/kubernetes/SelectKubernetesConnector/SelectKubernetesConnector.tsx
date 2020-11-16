import React from 'react'
import { Color, Container, Formik, FormikForm, FormInput, Heading, Text } from '@wings-software/uikit'
import { object as yupObject, string as yupString } from 'yup'
import { CVSelectionCardGroupProps, CVSelectionCardGroup } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { InfrastructureTypeOptions } from '../../ActivitySourceSetupConstants'
import i18n from './SelectKubernetesConnector.i18n'
import css from './SelectKubernetesConnector.module.scss'

export interface SelectKubernetesConnectorProps {
  initialValues?: any
  onSubmit?: (data: any) => void
}

interface ActivitySourceConnectorSelectionProps {
  connectorSelections: Array<{ category: string; products: CVSelectionCardGroupProps }>
}

export const KubernetesActivitySourceFieldNames = {
  ACTIVITY_SOURCE_NAME: 'name',
  INFRA_TYPE: 'infrastructureType'
}

const ProductSelections: ActivitySourceConnectorSelectionProps['connectorSelections'] = [
  {
    category: i18n.productSelectionCategory.directConnection,
    products: {
      cards: [
        {
          iconProps: {
            name: 'service-kubernetes',
            size: 25
          },
          cardLabel: i18n.productName.kubernetes,
          className: css.productSelectionCard
        }
      ]
    }
  }
]

const ValidationSchema = yupObject().shape({
  [KubernetesActivitySourceFieldNames.ACTIVITY_SOURCE_NAME]: yupString()
    .trim()
    .required(i18n.validationStrings.nameActivitySource),
  [KubernetesActivitySourceFieldNames.INFRA_TYPE]: yupString().trim().required(i18n.validationStrings.infraType)
})

function ActivitySourceConnectorSelection(props: ActivitySourceConnectorSelectionProps): JSX.Element {
  const { connectorSelections: productSelections } = props
  return (
    <Container className={css.connectorSelection}>
      {productSelections.map(({ category, products }) => {
        return (
          <Container key={category}>
            <Text className={css.category}>{category}</Text>
            <CVSelectionCardGroup {...products} />
          </Container>
        )
      })}
    </Container>
  )
}

export function SelectKubernetesConnector(props: SelectKubernetesConnectorProps): JSX.Element {
  const { onSubmit, initialValues } = props
  return (
    <Container className={css.main}>
      <Heading level="3" color={Color.BLACK} font={{ size: 'medium' }} className={css.heading}>
        {i18n.selectActivitySource}
      </Heading>
      <Formik
        initialValues={initialValues || {}}
        onSubmit={values => onSubmit?.(values)}
        validationSchema={ValidationSchema}
      >
        <FormikForm id="onBoardingForm">
          <Container>
            <AddDescriptionAndTagsWithIdentifier
              identifierProps={{ inputLabel: i18n.fieldLabels.nameActivitySource }}
            />
            <FormInput.Select
              items={InfrastructureTypeOptions}
              label={i18n.fieldLabels.infraType}
              name={KubernetesActivitySourceFieldNames.INFRA_TYPE}
            />
            <Text color={Color.BLACK} className={css.infraSpecification}>
              {i18n.infraSpecification}
            </Text>
            <Text color={Color.BLACK} className={css.connectorOptionHeading}>
              {i18n.connectorOptionHeading}
            </Text>
            <ActivitySourceConnectorSelection connectorSelections={ProductSelections} />
          </Container>
        </FormikForm>
      </Formik>
    </Container>
  )
}
