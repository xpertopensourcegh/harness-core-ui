import React, { useState } from 'react'
import {
  Button,
  ButtonVariation,
  Color,
  Container,
  Layout,
  useConfirmationDialog,
  useToaster
} from '@wings-software/uicore'
import { defaultTo, get, set } from 'lodash-es'
import { useParams } from 'react-router-dom'
import produce from 'immer'
import { parse } from 'yaml'
import { Intent } from '@blueprintjs/core'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { Failure, getTemplateInputSetYamlPromise, TemplateSummaryResponse } from 'services/template-ng'
import { useStrings } from 'framework/strings'
import { Scope } from '@common/interfaces/SecretsInterface'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { GitSyncStoreProvider } from 'framework/GitRepoStore/GitSyncStoreContext'
import NoResultsView from '@templates-library/pages/TemplatesPage/views/NoResultsView/NoResultsView'
import type { TemplateConfig } from '@pipeline/utils/tempates'
import { DefaultNewVersionLabel } from 'framework/Templates/templates'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { TemplateSelectorLeftView } from '@templates-library/components/TemplateSelector/TemplateSelectorLeftView/TemplateSelectorLeftView'
import { TemplateDetails } from '../TemplateDetails/TemplateDetails'
import css from './TemplateSelector.module.scss'

export const TemplateSelector: React.FC = (): JSX.Element => {
  const {
    state: {
      templateView: {
        templateDrawerData: { data }
      },
      templateTypes
    },
    setTemplateTypes
  } = usePipelineContext()
  const { onUseTemplate, onCopyTemplate, selectedTemplateRef } = data?.selectorData || {}
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummaryResponse | undefined>()
  const { getString } = useStrings()
  const { accountId } = useParams<ProjectPathProps & ModulePathParams>()
  const { isGitSyncEnabled } = useAppStore()
  const { showError } = useToaster()

  const getScopeBasedTemplateRef = React.useCallback((template?: TemplateSummaryResponse) => {
    const templateIdentifier = defaultTo(template?.identifier, '')
    const scope = getScopeFromDTO(defaultTo(template, {}))
    return scope === Scope.PROJECT ? templateIdentifier : `${scope}.${templateIdentifier}`
  }, [])

  const getTemplateDetails: React.ReactElement = React.useMemo(() => {
    if (selectedTemplate) {
      return (
        <TemplateDetails template={selectedTemplate} setTemplate={setSelectedTemplate} allowStableSelection={true} />
      )
    } else {
      return <></>
    }
  }, [selectedTemplate, setSelectedTemplate])

  const submit = React.useCallback(async () => {
    const templateIdentifier = defaultTo(selectedTemplate?.identifier, '')
    const resp = await getTemplateInputSetYamlPromise({
      templateIdentifier,
      queryParams: {
        accountIdentifier: accountId,
        orgIdentifier: selectedTemplate?.orgIdentifier,
        projectIdentifier: selectedTemplate?.projectIdentifier,
        versionLabel:
          selectedTemplate?.versionLabel === DefaultNewVersionLabel ? '' : defaultTo(selectedTemplate?.versionLabel, '')
      }
    })
    if (resp.status === 'SUCCESS') {
      set(templateTypes, templateIdentifier, selectedTemplate?.childType)
      setTemplateTypes(templateTypes)
      const templateConfig = produce({} as TemplateConfig, draft => {
        draft.templateRef = getScopeBasedTemplateRef(selectedTemplate)
        if (selectedTemplate?.versionLabel !== DefaultNewVersionLabel) {
          draft.versionLabel = defaultTo(selectedTemplate?.versionLabel, '')
        }
        draft.templateInputs = parse(defaultTo(resp.data, ''))
      })
      onUseTemplate?.(templateConfig)
    } else {
      showError(get(resp, 'data.error', get(resp, 'data.message', (resp as Failure)?.message)))
      timerRef.current?.('cancelled')
    }
  }, [selectedTemplate, accountId, onUseTemplate])

  const { openDialog: openChangeTemplateDialog } = useConfirmationDialog({
    intent: Intent.WARNING,
    cancelButtonText: getString('cancel'),
    contentText: getString('pipeline.changeTemplate', { name: selectedTemplate?.name }),
    titleText: selectedTemplateRef
      ? `Change to Template ${selectedTemplate?.name}?`
      : `Use Template ${selectedTemplate?.name}?`,
    confirmButtonText: getString('yes'),
    onCloseDialog: async isConfirmed => {
      if (isConfirmed) {
        await submit()
      } else {
        timerRef.current?.('cancelled')
      }
    }
  })

  const { openDialog: openCopyTemplateDialog } = useConfirmationDialog({
    intent: Intent.WARNING,
    cancelButtonText: getString('cancel'),
    contentText: getString('pipeline.copyTemplate', { name: selectedTemplate?.name }),
    titleText: `Copy Template ${selectedTemplate?.name}?`,
    confirmButtonText: getString('yes'),
    onCloseDialog: async isConfirmed => {
      if (isConfirmed && selectedTemplate) {
        onCopyTemplate?.(selectedTemplate)
      }
    }
  })

  const timerRef = React.useRef<((reason: any) => void) | null>(null)

  const onUseTemplateClick = React.useCallback(async () => {
    openChangeTemplateDialog()
    await new Promise(function (_resolve, reject) {
      timerRef.current = reject
    })
  }, [selectedTemplateRef, openChangeTemplateDialog, submit])

  return (
    <Container height={'100%'} className={css.container}>
      <Layout.Horizontal height={'100%'}>
        <TemplateSelectorLeftView setTemplate={setSelectedTemplate} />
        <Container width={525}>
          {selectedTemplate ? (
            <Layout.Vertical height={'100%'}>
              <Container className={css.detailsContainer}>
                {isGitSyncEnabled ? (
                  <GitSyncStoreProvider>{getTemplateDetails}</GitSyncStoreProvider>
                ) : (
                  getTemplateDetails
                )}
              </Container>
              <Container>
                <Layout.Horizontal
                  padding={'xxlarge'}
                  background={Color.FORM_BG}
                  className={css.btnContainer}
                  spacing={'small'}
                >
                  <Button
                    variation={ButtonVariation.PRIMARY}
                    text={getString('templatesLibrary.useTemplate')}
                    onClick={onUseTemplateClick}
                  />
                  <Button
                    variation={ButtonVariation.LINK}
                    text={getString('templatesLibrary.copyToPipeline')}
                    onClick={openCopyTemplateDialog}
                  />
                </Layout.Horizontal>
              </Container>
            </Layout.Vertical>
          ) : (
            <Container padding={{ top: 'xxlarge', right: 'xlarge', bottom: 'xxlarge', left: 'xlarge' }} height={'100%'}>
              <Layout.Vertical
                className={css.empty}
                spacing={'large'}
                height={'100%'}
                flex={{ align: 'center-center' }}
              >
                <NoResultsView text={getString('templatesLibrary.selectTemplateToPreview')} minimal={true} />
              </Layout.Vertical>
            </Container>
          )}
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}
