import React from 'react'
import { Color, Container, Formik, FormikForm, FormInput, Heading, Text } from '@wings-software/uikit'
import { object as yupObject, string as yupString } from 'yup'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { CVSelectionCard, CVSelectionCardProps } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { InfrastructureTypeOptions } from '../../ActivitySourceSetupConstants'
import i18n from './SelectActivitySource.i18n'
import css from './SelectActivitySource.module.scss'

export interface SelectActivitySourceProps {
  data?: any
  onSubmit?: (data: any) => void
}

interface ActivitySourceConnectorSelectionProps {
  onCardSelect: (fieldName: string, value?: string) => void
  selectedCard?: string
}

export const KubernetesActivitySourceFieldNames = {
  ACTIVITY_SOURCE_NAME: 'name',
  INFRASTRUCTURE_TYPE: 'infrastructureType',
  CONNECTOR_TYPE: 'connectorType'
}

const DirectConnectionsProductSelections: { category: string; products: CVSelectionCardProps[] } = {
  category: i18n.productSelectionCategory.directConnection,
  products: [
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

const ValidationSchema = yupObject().shape({
  [KubernetesActivitySourceFieldNames.ACTIVITY_SOURCE_NAME]: yupString()
    .trim()
    .required(i18n.validationStrings.nameActivitySource),
  [KubernetesActivitySourceFieldNames.INFRASTRUCTURE_TYPE]: yupString()
    .trim()
    .required(i18n.validationStrings.infraType),
  [KubernetesActivitySourceFieldNames.CONNECTOR_TYPE]: yupString().trim().required(i18n.validationStrings.connectorType)
})

function ActivitySourceConnectorSelection(props: ActivitySourceConnectorSelectionProps): JSX.Element {
  const { onCardSelect, selectedCard } = props
  return (
    <Container className={css.connectorSelection}>
      <Container>
        <Text className={css.category}>{DirectConnectionsProductSelections.category}</Text>
        {DirectConnectionsProductSelections.products.map(cardProps => {
          return (
            <CVSelectionCard
              key={cardProps.cardLabel}
              {...cardProps}
              isSelected={cardProps.cardLabel === selectedCard}
              onCardSelect={isSelected => {
                if (isSelected) {
                  onCardSelect(KubernetesActivitySourceFieldNames.CONNECTOR_TYPE, cardProps.cardLabel)
                } else {
                  onCardSelect(KubernetesActivitySourceFieldNames.CONNECTOR_TYPE, '')
                }
              }}
            />
          )
        })}
      </Container>
    </Container>
  )
}

export function SelectActivitySource(props: SelectActivitySourceProps): JSX.Element {
  const { onSubmit, data } = props
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  return (
    <Formik initialValues={data || {}} onSubmit={values => onSubmit?.(values)} validationSchema={ValidationSchema}>
      <FormikForm>
        <Container className={css.main}>
          <Heading level="3" color={Color.BLACK} font={{ size: 'medium' }} className={css.heading}>
            {i18n.selectActivitySource}
          </Heading>
          <AddDescriptionAndTagsWithIdentifier identifierProps={{ inputLabel: i18n.fieldLabels.nameActivitySource }} />
          <FormInput.Select
            items={InfrastructureTypeOptions}
            label={i18n.fieldLabels.infraType}
            name={KubernetesActivitySourceFieldNames.INFRASTRUCTURE_TYPE}
          />
          <Text color={Color.BLACK} className={css.infraSpecification}>
            {i18n.infraSpecification}
          </Text>
          <Text color={Color.BLACK} className={css.connectorOptionHeading}>
            {i18n.connectorOptionHeading}
          </Text>
          <FormInput.CustomRender
            name={KubernetesActivitySourceFieldNames.CONNECTOR_TYPE}
            render={formikProps => (
              <ActivitySourceConnectorSelection
                onCardSelect={formikProps.setFieldValue}
                selectedCard={formikProps.values?.[KubernetesActivitySourceFieldNames.CONNECTOR_TYPE]}
              />
            )}
          />
        </Container>
        <SubmitAndPreviousButtons
          onPreviousClick={() =>
            history.push(
              routes.toCVAdminSetup({
                projectIdentifier: projectIdentifier as string,
                orgIdentifier: orgIdentifier as string,
                accountId
              })
            )
          }
        />
      </FormikForm>
    </Formik>
  )
}
