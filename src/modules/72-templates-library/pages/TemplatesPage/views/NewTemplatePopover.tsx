import React, { useContext } from 'react'
import { Menu, Position } from '@blueprintjs/core'
import { ButtonVariation } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import { getAllowedTemplateTypes, TemplateType } from '@templates-library/utils/templatesUtils'
import routes from '@common/RouteDefinitions'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { TemplatesActionPopover } from '@templates-library/components/TemplatesActionPopover/TemplatesActionPopover'
import { DefaultNewTemplateId } from 'framework/Templates/templates'

import RbacButton from '@rbac/components/Button/Button'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { TemplateContext } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateContext'

export function NewTemplatePopover(): React.ReactElement {
  const handleAddTemplate = () => undefined
  const { getString } = useStrings()
  const history = useHistory()
  const allowedTemplateTypes = getAllowedTemplateTypes(getString)
  const { projectIdentifier, orgIdentifier, accountId, module } = useParams<ProjectPathProps & ModulePathParams>()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { isReadonly } = useContext(TemplateContext)

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
      <Menu style={{ width: '120px' }} onClick={e => e.stopPropagation()}>
        {allowedTemplateTypes.map(templateType => (
          <Menu.Item
            text={templateType.label}
            key={templateType.value}
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
    <TemplatesActionPopover
      open={menuOpen}
      minimal={true}
      content={renderMenu()}
      position={Position.BOTTOM}
      disabled={isReadonly}
      setMenuOpen={setMenuOpen}
    >
      <RbacButton
        variation={ButtonVariation.PRIMARY}
        icon="plus"
        rightIcon="chevron-down"
        text={getString('templatesLibrary.addNewTemplate')}
        onClick={handleAddTemplate}
        permission={{
          permission: PermissionIdentifier.EDIT_TEMPLATE,
          resource: {
            resourceType: ResourceType.TEMPLATE
          }
        }}
      />
    </TemplatesActionPopover>
  )
}
