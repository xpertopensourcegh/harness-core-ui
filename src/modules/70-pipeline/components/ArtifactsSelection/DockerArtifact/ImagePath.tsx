import React from 'react'
import { IOptionProps, Menu } from '@blueprintjs/core'
import {
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  MultiTypeInputType,
  Button,
  StepProps,
  Text
} from '@wings-software/uicore'
import { Form } from 'formik'
import memoize from 'lodash-es/memoize'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useGetBuildDetailsForDocker } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { StringUtils } from '@common/exports'
import i18n from '../ArtifactsSelection.i18n'
import css from './DockerArtifact.module.scss'

interface ImagePathProps {
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    identifier?: string
    tag?: string
    tagRegex?: string
  }) => void
  name?: string
  context?: number
  initialValues: any
}

const primarySchema = Yup.object().shape({
  imagePath: Yup.string().trim().required(i18n.validation.imagePath),
  tagType: Yup.string().required(),
  tagRegex: Yup.string().when('tagType', {
    is: 'regex',
    then: Yup.string().trim().required('Tag Regex is required')
  }),
  tag: Yup.string().when('tagType', {
    is: 'value',
    then: Yup.string().trim().required('Tag is required')
  })
})

const sidecarSchema = Yup.object().shape({
  connectorId: Yup.string().trim().required(i18n.validation.connectorId),
  identifier: Yup.string()
    .trim()
    .required(i18n.validation.sidecarId)
    .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
    .notOneOf(StringUtils.illegalIdentifiers),
  imagePath: Yup.string().trim().required('Image Path is required'),
  tagType: Yup.string().required(),
  tagRegex: Yup.string().when('tagType', {
    is: 'regex',
    then: Yup.string().trim().required('Tag Regex is required')
  }),
  tag: Yup.string().when('tagType', {
    is: 'value',
    then: Yup.string().trim().required('Tag is required')
  })
})

const tagOptions: IOptionProps[] = [
  {
    label: 'Value',
    value: 'value'
  },
  {
    label: 'Regex',
    value: 'regex'
  }
]

export const ImagePath: React.FC<StepProps<any> & ImagePathProps> = props => {
  const { name, context, handleSubmit, prevStepData, initialValues } = props
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [tagList, setTagList] = React.useState([])
  const [lastImagePath, setLastImagePath] = React.useState('')

  const { data, loading, refetch } = useGetBuildDetailsForDocker({
    queryParams: {
      imagePath: lastImagePath,
      connectorRef: prevStepData?.connectorId?.value
        ? prevStepData?.connectorId?.value
        : prevStepData?.identifier || '',
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    },
    lazy: true
  })

  React.useEffect(() => {
    if (Array.isArray(data?.data?.buildDetailsList)) {
      setTagList(data?.data?.buildDetailsList as [])
    }
  }, [data])
  React.useEffect(() => {
    refetch()
  }, [lastImagePath])
  const getSelectItems = React.useCallback(() => {
    const list = tagList?.map(({ tag }: { tag: string }) => ({ label: tag, value: tag }))
    return list
  }, [tagList])
  const tags = loading ? [{ label: 'Loading Tags...', value: 'Loading Tags...' }] : getSelectItems()
  const getInitialValues = () => {
    const initialData = {
      ...initialValues
    }
    if (getMultiTypeFromValue(prevStepData?.connectorId) === MultiTypeInputType.RUNTIME) {
      initialData.connectorId = prevStepData?.connectorId
    } else if (prevStepData?.connectorId?.value) {
      initialData.connectorId = prevStepData?.connectorId?.value
    } else {
      initialData.connectorId = prevStepData?.identifier || ''
    }
    if (getMultiTypeFromValue(initialValues?.tag) === MultiTypeInputType.FIXED) {
      initialData.tag = initialValues?.tag?.map((tag: string) => ({ label: tag, value: tag }))
    }

    return initialData
  }
  const fetchTags = (imagePath = '') => {
    if (imagePath.length && lastImagePath !== imagePath) {
      setLastImagePath(imagePath)
    }
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
        validationSchema={context === 2 ? sidecarSchema : primarySchema}
        onSubmit={formData => {
          handleSubmit({
            ...prevStepData,
            ...formData,
            tag: Array.isArray(formData?.tag)
              ? formData?.tag?.map((tag: { label: string; value: string }) => tag.value)
              : formData.tag
          })
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              {context === 2 && (
                <div className={css.dockerSideCard}>
                  <FormInput.Text
                    label={i18n.existingDocker.sidecarId}
                    placeholder={i18n.existingDocker.sidecarIdPlaceholder}
                    name="identifier"
                  />
                </div>
              )}
              <div className={css.imagePathContainer}>
                <FormInput.MultiTextInput
                  label={i18n.existingDocker.imageName}
                  name="imagePath"
                  placeholder={i18n.existingDocker.imageNamePlaceholder}
                />
                {getMultiTypeFromValue(formik.values.imagePath) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      value={formik.values.imagePath as string}
                      type="String"
                      variableName="dockerConnector"
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

              <div className={css.tagGroup}>
                <FormInput.RadioGroup
                  name="tagType"
                  radioGroup={{ inline: true }}
                  items={tagOptions}
                  className={css.radioGroup}
                />
              </div>
              {formik.values.tagType === 'value' ? (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTypeInput
                    selectItems={tags}
                    disabled={!formik.values?.imagePath?.length}
                    multiTypeInputProps={{
                      selectProps: {
                        noResults: (
                          <span className={css.padSmall}>{getString('pipelineSteps.deploy.errors.notags')}</span>
                        ),
                        items: tags,
                        addClearBtn: true,
                        itemRenderer: itemRenderer
                      },
                      onFocus: () => fetchTags(formik.values.imagePath)
                    }}
                    label={i18n.existingDocker.tag}
                    name="tag"
                  />

                  {getMultiTypeFromValue(formik.values.tag) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        value={formik.values.tag as string}
                        type="String"
                        variableName="dockerConnector"
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
              ) : null}

              {formik.values.tagType === 'regex' ? (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTextInput
                    label={i18n.existingDocker.tagRegex}
                    name="tagRegex"
                    placeholder={i18n.existingDocker.enterTagRegex}
                  />
                  {getMultiTypeFromValue(formik.values.tagRegex) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        value={formik.values.tagRegex as string}
                        type="String"
                        variableName="dockerConnector"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          formik.setFieldValue('tagRegex', value)
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <Button intent="primary" type="submit" text={i18n.existingDocker.save} className={css.saveBtn} />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}
