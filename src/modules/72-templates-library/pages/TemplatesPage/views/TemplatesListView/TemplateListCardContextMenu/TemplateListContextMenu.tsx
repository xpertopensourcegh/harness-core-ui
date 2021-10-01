import React from 'react'
import { Button } from '@wings-software/uicore'
import type { IconName } from '@blueprintjs/core'
import type { PopoverProps } from '@wings-software/uicore/dist/components/Popover/Popover'
import { useStrings } from 'framework/strings'
import { TemplatesActionPopover } from '@templates-library/components/TemplatesActionPopover/TemplatesActionPopover'
import type { TemplateSummaryResponse } from 'services/template-ng'
import css from './TemplateListCardContextMenu.module.scss'

interface ContextMenuProps extends PopoverProps {
  template: TemplateSummaryResponse
  onPreview?: (template: TemplateSummaryResponse) => void
  onOpenEdit?: (template: TemplateSummaryResponse) => void
  onOpenSettings?: (templateIdentifier: string) => void
  onDelete?: (templateIdentifier: string) => void
  className?: string
}

export const TemplateListContextMenu: React.FC<ContextMenuProps> = (props): JSX.Element => {
  const { getString } = useStrings()
  const { template, onPreview, onOpenEdit, onOpenSettings, onDelete, className, ...popoverProps } = props
  const [menuOpen, setMenuOpen] = React.useState(false)

  const getItems = (): { icon: IconName; text: string; onClick: () => void }[] => {
    return [
      {
        icon: 'eye-open',
        text: getString('connectors.ceAws.crossAccountRoleExtention.step1.p2'),
        onClick: () => {
          onPreview?.(template)
        }
      },
      {
        icon: 'folder-shared-open',
        text: getString('templatesLibrary.openEditTemplate'),
        onClick: () => {
          onOpenEdit?.(template)
        }
      },
      {
        icon: 'settings',
        text: getString('templatesLibrary.templateSettings'),
        onClick: () => {
          onOpenSettings?.(template.identifier || '')
        }
      },
      {
        icon: 'delete',
        text: getString('templatesLibrary.deleteTemplate'),
        onClick: () => {
          onDelete?.(template.identifier || '')
        }
      }
    ]
  }

  return (
    <TemplatesActionPopover
      open={menuOpen}
      items={getItems()}
      setMenuOpen={setMenuOpen}
      className={className}
      {...popoverProps}
    >
      <Button
        minimal
        className={css.actionButton}
        icon="more"
        onClick={e => {
          e.stopPropagation()
          setMenuOpen(true)
        }}
      />
    </TemplatesActionPopover>
  )
}
