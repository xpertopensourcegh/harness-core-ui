import React from 'react'
import { Dialog } from '@blueprintjs/core'
import { Button, ButtonVariation, useModalHook } from '@wings-software/uicore'
import { cloneDeep, noop } from 'lodash-es'
import { useHistory, useParams } from 'react-router'
import { parse } from 'yaml'
import { useStrings } from 'framework/strings'
import { DefaultNewTemplateId } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateReducer'
import type { ModulePathParams, TemplateStudioPathProps } from '@common/interfaces/RouteInterfaces'
import { TemplateCommentModal } from '@templates-library/components/TemplateStudio/TemplateCommentModal/TemplateCommentModal'
import {
  Fields,
  ModalProps,
  TemplateConfigModal
} from '@templates-library/components/TemplateConfigModal/TemplateConfigModal'
import { TemplateContext } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateContext'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/components'
import { SelectedView } from '@common/components/VisualYamlToggle/VisualYamlToggle'
import { TemplatesActionPopover } from '@templates-library/components/TemplatesActionPopover/TemplatesActionPopover'
import { useCreateTemplate, useUpdateExistingTemplateLabel, NGTemplateInfoConfig } from 'services/template-ng'
import { yamlStringify } from '@common/utils/YamlHelperMethods'
import css from './SaveTemplatePopover.module.scss'

export interface SaveTemplatePopoverProps {
  disabled?: boolean
}

export function SaveTemplatePopover(props: SaveTemplatePopoverProps): React.ReactElement {
  const {
    state: { template, yamlHandler },
    setLoading,
    fetchTemplate,
    deleteTemplateCache,
    updateTemplate,
    view
  } = React.useContext(TemplateContext)
  const { getString } = useStrings()
  const { disabled = false } = props
  const { templateIdentifier, templateType, projectIdentifier, orgIdentifier, accountId, module } = useParams<
    TemplateStudioPathProps & ModulePathParams
  >()
  const [modalProps, setModalProps] = React.useState<ModalProps>()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const history = useHistory()
  const { showSuccess, showError, clear } = useToaster()
  const isYaml = view === SelectedView.YAML

  const [showConfigModal, hideConfigModal] = useModalHook(
    () => (
      <Dialog enforceFocus={false} isOpen={true} className={css.createTemplateDialog}>
        <TemplateConfigModal initialValues={template} onClose={hideConfigModal} modalProps={modalProps} />
      </Dialog>
    ),
    [template, modalProps]
  )

  const [showCommentsModal, hideCommentsModal] = useModalHook(() => {
    return (
      <Dialog enforceFocus={false} isOpen={true} className={css.updateTemplateDialog}>
        <TemplateCommentModal
          title={getString('templatesLibrary.updateTemplateModal.heading', {
            name: template.name,
            version: template.versionLabel
          })}
          onClose={hideCommentsModal}
          onSubmit={comments => {
            hideCommentsModal()
            setLoading()
            updateExistingLabel(comments)
          }}
        />
      </Dialog>
    )
  }, [template])

  const navigateToLocation = (newTemplateId: string, versionLabel: string) => {
    history.replace(
      routes.toTemplateStudio({
        projectIdentifier,
        orgIdentifier,
        accountId,
        module,
        templateType: templateType,
        templateIdentifier: newTemplateId,
        versionLabel: versionLabel
      })
    )
  }

  const { mutate: updateExistingTemplateLabel } = useUpdateExistingTemplateLabel({
    templateIdentifier: '',
    versionLabel: '',
    requestOptions: { headers: { 'Content-Type': 'application/yaml' } }
  })

  const updateExistingLabel = async (comments?: string) => {
    try {
      await updateExistingTemplateLabel(yamlStringify(cloneDeep(template)), {
        queryParams: {
          accountIdentifier: accountId,
          projectIdentifier,
          orgIdentifier,
          comments
        }
      })
      showSuccess(getString('templatesLibrary.templateUpdated'))
      await fetchTemplate({ forceFetch: true, forceUpdate: true })
    } catch (error) {
      showError(
        error?.message || getString('templatesLibrary.errorWhileUpdating'),
        undefined,
        'template.save.template.error'
      )
      await fetchTemplate({ forceFetch: true, forceUpdate: true })
    }
  }

  const { mutate: createTemplate } = useCreateTemplate({
    requestOptions: { headers: { 'Content-Type': 'application/yaml' } }
  })

  const createNewTemplate = async (latestTemplate: NGTemplateInfoConfig) => {
    if (isYaml && yamlHandler) {
      if (!parse(yamlHandler.getLatestYaml())) {
        clear()
        showError(getString('invalidYamlText'))
      }
      try {
        latestTemplate = parse(yamlHandler.getLatestYaml()).template as NGTemplateInfoConfig
      } /* istanbul ignore next */ catch (err) {
        showError(err.message || err, undefined, 'pipeline.save.pipeline.error')
      }
    }
    try {
      await createTemplate(yamlStringify(cloneDeep(template)), {
        queryParams: {
          accountIdentifier: accountId,
          projectIdentifier,
          orgIdentifier
        }
      })
      showSuccess(getString('templatesLibrary.publishTemplate'))
      if (templateIdentifier === DefaultNewTemplateId) {
        await deleteTemplateCache()
      }
      navigateToLocation(latestTemplate.identifier, latestTemplate.versionLabel)
    } catch (error) {
      showError(
        error?.message || getString('templatesLibrary.errorWhileSaving'),
        undefined,
        'template.save.template.error'
      )
    }
  }

  const saveAndPublish = React.useCallback(async () => {
    hideConfigModal()
    setLoading()
    await createNewTemplate(template)
  }, [template])

  const saveAsNewLabel = (): void => {
    setModalProps({
      title: getString('templatesLibrary.saveAsNewLabelModal.heading'),
      onSubmit: async values => {
        hideConfigModal()
        setLoading()
        await updateTemplate(values)
        await createNewTemplate(values)
      },
      disabledFields: [Fields.Identifier]
    })
    showConfigModal()
  }

  const saveAsNewTemplate = (): void => {
    setModalProps({
      title: getString('templatesLibrary.saveAsNewTemplateModal.heading'),
      onSubmit: async values => {
        hideConfigModal()
        setLoading()
        await createNewTemplate(values)
      }
    })
    showConfigModal()
  }

  const saveOptions =
    templateIdentifier === DefaultNewTemplateId
      ? [
          {
            text: getString('save'),
            onClick: saveAndPublish
          }
        ]
      : [
          {
            text: getString('save'),
            onClick: showCommentsModal
          },
          {
            text: getString('templatesLibrary.saveAsNewLabelModal.heading'),
            onClick: saveAsNewLabel
          },
          {
            text: getString('templatesLibrary.saveAsNewTemplateModal.heading'),
            onClick: saveAsNewTemplate
          }
        ]

  return (
    <TemplatesActionPopover
      open={menuOpen}
      disabled={saveOptions.length === 1}
      items={saveOptions}
      setMenuOpen={setMenuOpen}
    >
      <Button
        disabled={disabled}
        variation={ButtonVariation.PRIMARY}
        rightIcon={saveOptions.length > 1 ? 'chevron-down' : undefined}
        text={getString('save')}
        onClick={saveOptions.length === 1 ? () => saveOptions[0].onClick() : noop}
        icon="send-data"
      />
    </TemplatesActionPopover>
  )
}
