import React, { useMemo } from 'react'
import {
  Button,
  Color,
  Container,
  Formik,
  Heading,
  IconName,
  Layout,
  StepProps,
  ThumbnailSelect
} from '@wings-software/uicore'
import { Form } from 'formik'
import * as Yup from 'yup'
import { useStrings } from 'framework/strings'

import type { ConnectorConfigDTO } from 'services/cd-ng'
import { ArtifactIconByType, ArtifactTitleIdByType } from '../ArtifactHelper'
import type { ArtifactType, InitialArtifactDataType } from '../ArtifactInterface'
import css from './ArtifactConnector.module.scss'

interface ArtifactPropType {
  changeArtifactType: (selected: ArtifactType) => void
  artifactTypes: Array<ArtifactType>
  selectedArtifact: ArtifactType | null
  artifactInitialValue: InitialArtifactDataType
  stepName: string
}

export const ArtifactoryRepoType: React.FC<StepProps<ConnectorConfigDTO> & ArtifactPropType> = ({
  selectedArtifact,
  artifactTypes,
  changeArtifactType,
  stepName,
  artifactInitialValue,
  nextStep
}) => {
  const [selectedArtifactType, setSelectedArtifactType] = React.useState(selectedArtifact)

  const handleOptionSelection = (selected: ArtifactType): void => {
    setSelectedArtifactType(selected)
    changeArtifactType(selected)
  }

  const gotoNextStep = (): void => {
    changeArtifactType(selectedArtifactType as ArtifactType)
    if (selectedArtifactType !== artifactInitialValue.submittedArtifact) {
      nextStep?.({ connectorId: '' })
    } else {
      nextStep?.()
    }
  }

  const { getString } = useStrings()

  const supportedArtifactTypes = useMemo(
    () =>
      artifactTypes.map(artifact => ({
        label: getString(ArtifactTitleIdByType[artifact]),
        icon: ArtifactIconByType[artifact] as IconName,
        value: artifact
      })),
    [artifactTypes]
  )
  return (
    <Container className={css.optionsViewContainer}>
      <Heading level={2} style={{ color: Color.BLACK, fontSize: 24 }} margin={{ bottom: 'large' }}>
        {stepName}
      </Heading>
      <Formik
        initialValues={{ artifactType: selectedArtifactType }}
        formName="artifactType"
        validationSchema={Yup.object().shape({
          artifactType: Yup.string().required(getString('pipeline.artifactsSelection.artifactTyperequired'))
        })}
        onSubmit={gotoNextStep}
        enableReinitialize={true}
      >
        {() => (
          <Form>
            <div className={css.headerContainer}>
              <Layout.Horizontal spacing="large">
                <ThumbnailSelect
                  className={css.thumbnailSelect}
                  name={'artifactType'}
                  items={supportedArtifactTypes}
                  onChange={handleOptionSelection}
                />
              </Layout.Horizontal>
            </div>
            <Layout.Horizontal>
              <Button
                intent="primary"
                type="submit"
                disabled={selectedArtifact === null}
                text={getString('continue')}
                rightIcon="chevron-right"
                className={css.saveBtn}
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
