/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useCallback, useEffect, useState } from 'react'
import {
  Formik,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  MultiTypeInputType,
  Button,
  StepProps,
  Text,
  ButtonVariation,
  FontVariation
} from '@wings-software/uicore'
import { Form } from 'formik'
import * as Yup from 'yup'
import { defaultTo, get, merge } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import type { GitQueryParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useQueryParams } from '@common/hooks'

import { ConnectorConfigDTO, DockerBuildDetailsDTO, useGetBuildDetailsForNexusArtifact } from 'services/cd-ng'
import {
  checkIfQueryParamsisNotEmpty,
  getArtifactFormData,
  getConnectorIdValue,
  getFinalArtifactObj,
  repositoryFormat,
  resetTag,
  shouldFetchTags
} from '@pipeline/components/ArtifactsSelection/ArtifactUtils'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { ArtifactType, ImagePathProps, ImagePathTypes, RepositoryPortOrServer } from '../../../ArtifactInterface'
import { ArtifactIdentifierValidation, repositoryPortOrServer } from '../../../ArtifactHelper'
import ArtifactImagePathTagView from '../ArtifactImagePathTagView/ArtifactImagePathTagView'
import SideCarArtifactIdentifier from '../SideCarArtifactIdentifier'
import css from '../../ArtifactConnector.module.scss'

export const NexusArtifact: React.FC<StepProps<ConnectorConfigDTO> & ImagePathProps> = ({
  context,
  handleSubmit,
  expressions,
  allowableTypes,
  prevStepData,
  initialValues,
  previousStep,
  artifactIdentifiers,
  isReadonly = false,
  selectedArtifact
}) => {
  const { getString } = useStrings()
  const [lastQueryData, setLastQueryData] = useState({ imagePath: '', repository: '' })
  const [tagList, setTagList] = useState<DockerBuildDetailsDTO[] | undefined>([])
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { repoIdentifier, branch } = useQueryParams<GitQueryParams>()

  const schemaObject = {
    imagePath: Yup.string().trim().required(getString('pipeline.artifactsSelection.validation.imagePath')),
    repository: Yup.string().trim().required(getString('common.git.validation.repoRequired')),
    tagType: Yup.string().required(),
    tagRegex: Yup.string().when('tagType', {
      is: 'regex',
      then: Yup.string().trim().required(getString('pipeline.artifactsSelection.validation.tagRegex'))
    }),
    tag: Yup.mixed().when('tagType', {
      is: 'value',
      then: Yup.mixed().required(getString('pipeline.artifactsSelection.validation.tag'))
    }),
    repositoryPortorDockerServer: Yup.string().required(),
    dockerRepositoryServer: Yup.string().when('repositoryPortorDockerServer', {
      is: 'dockerRepositoryServer',
      then: Yup.string().required(getString('pipeline.artifactsSelection.validation.dockerRepositoryServer'))
    }),
    repositoryPort: Yup.string().when('repositoryPortorDockerServer', {
      is: 'repositoryPort',
      then: Yup.string().required(getString('pipeline.artifactsSelection.validation.repositoryPort'))
    })
  }

  const primarySchema = Yup.object().shape(schemaObject)
  const sidecarSchema = Yup.object().shape({
    ...schemaObject,
    ...ArtifactIdentifierValidation(
      artifactIdentifiers,
      initialValues?.identifier,
      getString('pipeline.uniqueIdentifier')
    )
  })

  const getConnectorRefQueryData = (): string => {
    return defaultTo(prevStepData?.connectorId?.value, prevStepData?.identifier)
  }

  const {
    data,
    loading: nexusBuildDetailsLoading,
    refetch: refetchNexusTag,
    error: nexusTagError
  } = useGetBuildDetailsForNexusArtifact({
    queryParams: {
      imagePath: lastQueryData.imagePath,
      repository: lastQueryData.repository,
      repositoryFormat,
      connectorRef: getConnectorRefQueryData(),
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      repoIdentifier,
      branch
    },
    lazy: true,
    debounce: 300
  })

  useEffect(() => {
    if (checkIfQueryParamsisNotEmpty(Object.values(lastQueryData))) {
      refetchNexusTag()
    }
  }, [lastQueryData, refetchNexusTag])

  useEffect(() => {
    if (nexusTagError) {
      setTagList([])
    } else if (Array.isArray(data?.data?.buildDetailsList)) {
      setTagList(data?.data?.buildDetailsList)
    }
  }, [data?.data?.buildDetailsList, nexusTagError])

  const canFetchTags = useCallback(
    (imagePath: string, repository: string): boolean => {
      return !!(
        lastQueryData.imagePath !== imagePath ||
        lastQueryData.repository !== repository ||
        shouldFetchTags(prevStepData, [imagePath, repository])
      )
    },
    [lastQueryData, prevStepData]
  )
  const fetchTags = useCallback(
    (imagePath = '', repository = ''): void => {
      if (canFetchTags(imagePath, repository)) {
        setLastQueryData({ imagePath, repository })
      }
    },
    [canFetchTags]
  )

  const isTagDisabled = useCallback((formikValue): boolean => {
    return !checkIfQueryParamsisNotEmpty([formikValue.imagePath, formikValue.repository])
  }, [])

  const getInitialValues = useCallback((): ImagePathTypes => {
    const values = getArtifactFormData(initialValues, selectedArtifact as ArtifactType, context === 2)
    const specValues = get(initialValues, 'spec', null)
    merge(specValues, {
      repositoryPortorDockerServer: specValues?.repositoryPort
        ? RepositoryPortOrServer.RepositoryPort
        : RepositoryPortOrServer.DockerRepositoryServer
    })
    return values
  }, [context, initialValues, selectedArtifact])

  const submitFormData = (formData: ImagePathTypes & { connectorId?: string }): void => {
    const repositoryPortOrServerData =
      formData?.repositoryPortorDockerServer === RepositoryPortOrServer.RepositoryPort
        ? { repositoryPort: formData?.repositoryPort }
        : { dockerRepositoryServer: formData?.dockerRepositoryServer }

    const artifactObj = getFinalArtifactObj(formData, context === 2)
    merge(artifactObj.spec, {
      repository: formData?.repository,
      repositoryFormat,
      ...repositoryPortOrServerData
    })
    handleSubmit(artifactObj)
  }

  return (
    <Layout.Vertical spacing="medium" className={css.firstep}>
      <Text font={{ variation: FontVariation.H3 }} margin={{ bottom: 'medium' }}>
        {getString('pipeline.artifactsSelection.artifactDetails')}
      </Text>
      <Formik
        initialValues={getInitialValues()}
        formName="imagePath"
        validationSchema={context === 2 ? sidecarSchema : primarySchema}
        onSubmit={formData => {
          submitFormData({
            ...prevStepData,
            ...formData,
            tag: defaultTo(formData?.tag?.value, formData?.tag),
            connectorId: getConnectorIdValue(prevStepData)
          })
        }}
      >
        {formik => (
          <Form>
            <div className={css.connectorForm}>
              {context === 2 && <SideCarArtifactIdentifier />}

              <div className={css.imagePathContainer}>
                <FormInput.MultiTextInput
                  label={getString('repository')}
                  name="repository"
                  placeholder={getString('pipeline.artifactsSelection.repositoryPlaceholder')}
                  multiTextInputProps={{
                    expressions,
                    allowableTypes
                  }}
                  onChange={() => {
                    tagList?.length && setTagList([])
                    resetTag(formik)
                  }}
                />

                {getMultiTypeFromValue(formik.values.repository) === MultiTypeInputType.RUNTIME && (
                  <div className={css.configureOptions}>
                    <ConfigureOptions
                      style={{ alignSelf: 'center' }}
                      value={formik.values?.repository as string}
                      type="String"
                      variableName="repository"
                      showRequiredField={false}
                      showDefaultField={false}
                      showAdvanced={true}
                      onChange={value => {
                        formik.setFieldValue('repository', value)
                      }}
                      isReadonly={isReadonly}
                    />
                  </div>
                )}
              </div>
              <div className={css.tagGroup}>
                <FormInput.RadioGroup
                  name="repositoryPortorDockerServer"
                  radioGroup={{ inline: true }}
                  items={repositoryPortOrServer}
                  className={css.radioGroup}
                />
              </div>

              {formik.values?.repositoryPortorDockerServer === 'dockerRepositoryServer' && (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTextInput
                    label={getString('pipeline.artifactsSelection.dockerRepositoryServer')}
                    name="dockerRepositoryServer"
                    placeholder={getString('pipeline.artifactsSelection.dockerRepositoryServerPlaceholder')}
                    multiTextInputProps={{
                      expressions,
                      allowableTypes
                    }}
                  />

                  {getMultiTypeFromValue(formik.values.dockerRepositoryServer) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        style={{ alignSelf: 'center' }}
                        value={formik.values?.dockerRepositoryServer as string}
                        type="String"
                        variableName="dockerRepositoryServer"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          formik.setFieldValue('dockerRepositoryServer', value)
                        }}
                        isReadonly={isReadonly}
                      />
                    </div>
                  )}
                </div>
              )}

              {formik.values?.repositoryPortorDockerServer === 'repositoryPort' && (
                <div className={css.imagePathContainer}>
                  <FormInput.MultiTextInput
                    label={getString('pipeline.artifactsSelection.repositoryPort')}
                    name="repositoryPort"
                    placeholder={getString('pipeline.artifactsSelection.repositoryPortPlaceholder')}
                    multiTextInputProps={{
                      expressions,
                      allowableTypes
                    }}
                  />

                  {getMultiTypeFromValue(formik.values.repositoryPort) === MultiTypeInputType.RUNTIME && (
                    <div className={css.configureOptions}>
                      <ConfigureOptions
                        style={{ alignSelf: 'center' }}
                        value={formik.values?.repositoryPort as unknown as string}
                        type="String"
                        variableName="repositoryPort"
                        showRequiredField={false}
                        showDefaultField={false}
                        showAdvanced={true}
                        onChange={value => {
                          formik.setFieldValue('repositoryPort', value)
                        }}
                        isReadonly={isReadonly}
                      />
                    </div>
                  )}
                </div>
              )}

              <ArtifactImagePathTagView
                selectedArtifact={selectedArtifact as ArtifactType}
                formik={formik}
                expressions={expressions}
                allowableTypes={allowableTypes}
                isReadonly={isReadonly}
                connectorIdValue={getConnectorIdValue(prevStepData)}
                fetchTags={imagePath => fetchTags(imagePath, formik?.values?.repository)}
                buildDetailsLoading={nexusBuildDetailsLoading}
                tagError={nexusTagError}
                tagList={tagList}
                setTagList={setTagList}
                tagDisabled={isTagDisabled(formik?.values)}
              />
            </div>
            <Layout.Horizontal spacing="medium">
              <Button
                variation={ButtonVariation.SECONDARY}
                text={getString('back')}
                icon="chevron-left"
                onClick={() => previousStep?.(prevStepData)}
              />
              <Button
                variation={ButtonVariation.PRIMARY}
                type="submit"
                text={getString('submit')}
                rightIcon="chevron-right"
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default NexusArtifact
