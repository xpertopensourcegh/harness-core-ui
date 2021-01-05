import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Heading, Text } from '@wings-software/uicore'
import { parse } from 'yaml'
import { pick, merge } from 'lodash-es'
import { InputSetSelector, InputSetSelectorProps } from '@pipeline/components/InputSetSelector/InputSetSelector'
import type { NgPipeline } from 'services/cd-ng'
import {
  useGetTemplateFromPipeline,
  getInputSetForPipelinePromise,
  useGetMergeInputSetFromPipelineTemplateWithListInput
} from 'services/pipeline-ng'
import { PipelineInputSetForm } from '@pipeline/components/PipelineInputSetForm/PipelineInputSetForm'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { useStrings } from 'framework/exports'

import { clearRuntimeInput } from '@pipeline/components/PipelineStudio/StepUtil'
import css from './WebhookPipelineInputPanel.module.scss'

interface WebhookPipelineInputPanelPropsInterface {
  formikProps?: any
}

const WebhookPipelineInputPanel: React.FC<WebhookPipelineInputPanelPropsInterface> = ({ formikProps }): JSX.Element => {
  const {
    values: { inputSetSelected, pipeline, originalPipeline },
    values
  } = formikProps
  const { orgIdentifier, accountId, projectIdentifier, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
    triggerIdentifier: string
  }>()
  const { data: template, loading } = useGetTemplateFromPipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, pipelineIdentifier, projectIdentifier }
  })
  const [selectedInputSets, setSelectedInputSets] = useState<InputSetSelectorProps['value']>(inputSetSelected)
  const { getString } = useStrings()

  useEffect(() => {
    setSelectedInputSets(inputSetSelected)
  }, [inputSetSelected])

  const { mutate: mergeInputSet } = useGetMergeInputSetFromPipelineTemplateWithListInput({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
  })

  useEffect(() => {
    if (template?.data?.inputSetTemplateYaml) {
      if ((selectedInputSets && selectedInputSets.length > 1) || selectedInputSets?.[0].type === 'OVERLAY_INPUT_SET') {
        const fetchData = async (): Promise<void> => {
          const data = await mergeInputSet({
            inputSetReferences: selectedInputSets.map(item => item.value as string)
          })
          if (data?.data?.pipelineYaml) {
            const pipelineObject = parse(data.data.pipelineYaml) as {
              pipeline: NgPipeline
            }
            formikProps.setValues({
              ...values,
              inputSetSelected: selectedInputSets,
              pipeline: clearRuntimeInput(merge(pipeline, pipelineObject.pipeline))
            })
          }
        }
        fetchData()
      } else if (selectedInputSets && selectedInputSets.length === 1) {
        const fetchData = async (): Promise<void> => {
          const data = await getInputSetForPipelinePromise({
            inputSetIdentifier: selectedInputSets[0].value as string,
            queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier, pipelineIdentifier }
          })
          if (data?.data?.inputSetYaml) {
            if (selectedInputSets[0].type === 'INPUT_SET') {
              const pipelineObject = pick(parse(data.data.inputSetYaml)?.inputSet, 'pipeline') as {
                pipeline: NgPipeline
              }
              formikProps.setValues({
                ...values,
                inputSetSelected: selectedInputSets,
                pipeline: clearRuntimeInput(merge(pipeline, pipelineObject.pipeline))
              })
            }
          }
        }
        fetchData()
      }
    }
  }, [
    template?.data?.inputSetTemplateYaml,
    selectedInputSets?.length,
    selectedInputSets,
    accountId,
    projectIdentifier,
    orgIdentifier,
    pipelineIdentifier
  ])

  return (
    <Layout.Vertical className={css.webhookPipelineInputContainer} spacing="large" padding="medium">
      {loading && (
        <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
          <PageSpinner />
        </div>
      )}
      {pipeline && template?.data?.inputSetTemplateYaml ? (
        <>
          <div className={css.pipelineInputRow}>
            <Heading level={2}>{getString('pipeline-triggers.pipelineInputLabel')}</Heading>
            <InputSetSelector
              pipelineIdentifier={pipelineIdentifier}
              onChange={value => {
                setSelectedInputSets(value)
              }}
              value={selectedInputSets}
            />
          </div>
          <PipelineInputSetForm
            originalPipeline={originalPipeline}
            template={
              (template?.data?.inputSetTemplateYaml && parse(template.data.inputSetTemplateYaml).pipeline) || {}
            }
            path="pipeline"
          />
        </>
      ) : (
        <Layout.Horizontal padding="medium" margin="medium">
          <Text>{getString('pipeline-triggers.pipelineInputPanel.noRuntimeInputs')}</Text>
        </Layout.Horizontal>
      )}
    </Layout.Vertical>
  )
}
export default WebhookPipelineInputPanel
