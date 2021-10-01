import React from 'react'
import { Menu, Position } from '@blueprintjs/core'
import { Button, ButtonVariation, Popover } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import { String, useStrings } from 'framework/strings'
import { getAllowedTemplateTypes, TemplateType } from '@templates-library/utils/templatesUtils'
import routes from '@common/RouteDefinitions'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { DefaultNewTemplateId } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateReducer'
import css from './NewTemplatePopover.module.scss'

export function NewTemplatePopover(): React.ReactElement {
  const handleAddTemplate = () => undefined
  const { getString } = useStrings()
  const history = useHistory()
  const allowedTemplateTypes = getAllowedTemplateTypes(getString)
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<ProjectPathProps & ModulePathParams>()

  const goToTemplateStudio = React.useCallback(
    (templateType: TemplateType) => {
      history.push(
        routes.toTemplateStudio({
          projectIdentifier,
          orgIdentifier,
          accountId,
          module,
          templateType,
          templateIdentifier: DefaultNewTemplateId
        })
      )
    },
    [projectIdentifier, orgIdentifier, accountId, module]
  )

  const renderMenu = () => {
    return (
      <Menu style={{ width: '120px' }} className={css.templateTypeMenu} onClick={e => e.stopPropagation()}>
        {allowedTemplateTypes.map(templateType => (
          <Menu.Item
            text={templateType.label}
            key={templateType.value}
            className={css.templateTypeMenuItem}
            disabled={templateType.disabled}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              goToTemplateStudio(templateType.value as TemplateType)
            }}
          />
        ))}
      </Menu>
    )
  }

  return (
    <Popover
      modifiers={{
        arrow: { enabled: false }
      }}
      content={renderMenu()}
      position={Position.BOTTOM}
    >
      <Button
        icon="plus"
        rightIcon="chevron-down"
        intent={'primary'}
        onClick={handleAddTemplate}
        variation={ButtonVariation.PRIMARY}
      >
        {<String stringID="templatesLibrary.addNewTemplate" />}
      </Button>
    </Popover>
  )
}
