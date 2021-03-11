import React from 'react'
import { Menu } from '@blueprintjs/core'

import {
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  MultiTypeInputType,
  Button,
  StepProps,
  RUNTIME_INPUT_VALUE,
  Text
} from '@wings-software/uicore'
import { Form } from 'formik'
import { useParams } from 'react-router-dom'
import memoize from 'lodash-es/memoize'
import * as Yup from 'yup'
import { get } from 'lodash-es'
import { useListAwsRegions } from 'services/portal'
import { ConnectorConfigDTO, useGetBuildDetailsForEcr } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import i18n from '../ArtifactsSelection.i18n'
import { ImagePathProps, ImagePathTypes, TagTypes } from '../ArtifactInterface'
import css from './ArtifactConnector.module.scss'

const ecrSchema = Yup.object().shape({
  imagePath: Yup.string().trim().required(i18n.validation.imagePath)
})

export const ECRArtifact: React.FC<StepProps<ConnectorConfigDTO> & ImagePathProps> = ({
  name,
  context,
  handleSubmit,
  prevStepData,
  initialValues
}) => {
  const { getString } = useStrings()
  const [tagList, setTagList] = React.useState([])
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [lastQueryData, setLastQueryData] = React.useState({ imagePath: '', region: '' })

  const { data: ecrBuildData, loading, refetch } = useGetBuildDetailsForEcr({
    queryParams: {
      imagePath: lastQueryData.imagePath,
      connectorRef: prevStepData?.connectorId?.value
        ? prevStepData?.connectorId?.value
        : prevStepData?.identifier || '',
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      region: lastQueryData.region
    },
    lazy: true
  })

  React.useEffect(() => {
    if (Array.isArray(ecrBuildData?.data?.buildDetailsList)) {
      setTagList(ecrBuildData?.data?.buildDetailsList as [])
    }
  }, [ecrBuildData])

  React.useEffect(() => {
    lastQueryData.region.length && lastQueryData.imagePath.length && refetch()
  }, [lastQueryData])

  const getSelectItems = React.useCallback(() => {
    const list = tagList?.map(({ tag }: { tag: string }) => ({ label: tag, value: tag }))
    return list
  }, [tagList])
  const tags = loading ? [{ label: 'Loading Tags...', value: 'Loading Tags...' }] : getSelectItems()

  // const [tagList, setTagList] = React.useState([])
  // const [lastImagePath, setLastImagePath] = React.useState('')

  const defaultQueryParams = {
    accountId
  }
  const { data } = useListAwsRegions({
    queryParams: defaultQueryParams
  })

  const { expressions } = useVariablesExpression()

  const regions = (data?.resource || []).map((region: any) => ({
    value: region.value,
    label: region.name
  }))

  const getInitialValues = (): Omit<ImagePathTypes, 'tag'> & { tag: any } => {
    const specValues = get(initialValues, 'spec', null)

    if (specValues) {
      const values = {
        ...specValues,
        tagType: specValues.tag ? TagTypes.Value : TagTypes.Regex
      }
      if (getMultiTypeFromValue(specValues?.tag) === MultiTypeInputType.FIXED) {
        values.tag = { label: specValues?.tag, value: specValues?.tag }
      }
      if (context === 2 && initialValues?.identifier) {
        values.identifier = initialValues?.identifier
      }
      return values
    }

    return {
      identifier: '',
      imagePath: '',
      tag: RUNTIME_INPUT_VALUE as string,
      tagType: TagTypes.Value,
      tagRegex: '',
      region: ''
    }
  }

  const fetchTags = (imagePath = '', region = '') => {
    if (
      imagePath.length &&
      region.length &&
      (lastQueryData.imagePath !== imagePath || lastQueryData.region !== region)
    ) {
      setLastQueryData({ imagePath, region })
    }
  }

  const getConnectorIdValue = (): string => {
    if (getMultiTypeFromValue(prevStepData?.connectorId) === MultiTypeInputType.RUNTIME) {
      return prevStepData?.connectorId
    }
    if (prevStepData?.connectorId?.value) {
      return prevStepData?.connectorId?.value
    }
    return prevStepData?.identifier || ''
  }

  const submitFormData = (formData: any): void => {
    const tagData = formData?.tagType === TagTypes.Value ? { tag: formData.tag } : { tagRegex: formData.tagRegex }

    const artifactObj: any = {
      spec: {
        connectorRef: formData?.connectorId,
        imagePath: formData?.imagePath,
        region: formData?.region?.value,
        ...tagData
      }
    }
    if (context === 2) {
      artifactObj.identifier = formData?.identifier
    }
    handleSubmit(artifactObj)
  }

  const itemRenderer = memoize((item: { label: string }, { handleClick }) => (
    <div key={item.label.toString()}>
      <Menu.Item
        text={
          <Layout.Horizontal spacing="small">
            <Text>{item.label}</Text>
          </Layout.Horizontal>
        }
        disabled={loading}
        onClick={handleClick}
      />
    </div>
  ))

  return (
    <Layout.Vertical spacing="xxlarge" className={css.firstep} data-id={name}>
      <div className={css.heading}>{i18n.specifyArtifactServer}</div>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={ecrSchema}
        onSubmit={formData => {
          submitFormData({
            ...prevStepData,
            ...formData,
            connectorId: getConnectorIdValue()
          })
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              <div className={css.imagePathContainer}>
                <FormInput.MultiTextInput
                  label={i18n.existingDocker.imageName}
                  name="imagePath"
                  placeholder={i18n.existingDocker.imageNamePlaceholder}
                  multiTextInputProps={{ expressions }}
                />
                {getMultiTypeFromValue(formik.values.imagePath) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="imagePath"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('imagePath', value)
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <FormInput.MultiTypeInput
                  selectItems={regions}
                  multiTypeInputProps={{ expressions }}
                  label={getString('pipelineSteps.regionLabel')}
                  name="region"
                />
                {getMultiTypeFromValue(formik.values.region) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="region"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('region', value)
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={css.imagePathContainer}>
                <FormInput.MultiTypeInput
                  selectItems={tags}
                  disabled={!formik.values?.imagePath?.length}
                  multiTypeInputProps={{
                    selectProps: {
                      defaultSelectedItem: formik.values?.tag,
                      items: tags,
                      itemRenderer: itemRenderer,
                      allowCreatingNewItems: true
                    },
                    onFocus: () => fetchTags(formik.values.imagePath, formik.values?.region)
                  }}
                  label={i18n.existingDocker.tag}
                  name="tag"
                />
                {getMultiTypeFromValue(formik.values.tag) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.tag as string}
                      type="String"
                      variableName="tag"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('tag', value)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}
