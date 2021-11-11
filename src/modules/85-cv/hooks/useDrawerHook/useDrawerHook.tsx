import React, { useMemo, useState } from 'react'
import { Drawer, Intent } from '@blueprintjs/core'
import { Button, useModalHook, useConfirmationDialog } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { getDefaultDrawerProps, getParsedDrawerOptions } from './useDrawerHook.utils'
import type { UseDrawerInterface, UseDrawerPropsInterface } from './useDrawerHook.types'
import css from './useDrawerHook.module.scss'

export const useDrawer = ({
  createHeader,
  createDrawerContent,
  drawerOptions
}: UseDrawerPropsInterface): UseDrawerInterface => {
  const { getString } = useStrings()
  const [drawerContentProps, setDrawerContentProps] = useState({})
  const [drawerHeaderProps, setDrawerHeaderProps] = useState({})

  const { openDialog: showWarning } = useConfirmationDialog({
    intent: Intent.WARNING,
    contentText: getString('common.unsavedChanges'),
    titleText: getString('common.confirmText'),
    cancelButtonText: getString('cancel'),
    confirmButtonText: getString('confirm'),
    onCloseDialog: (isConfirmed: boolean) => isConfirmed && hideModal()
  })

  const header = createHeader ? createHeader(drawerHeaderProps) : undefined
  const defaultOptions = useMemo(() => getDefaultDrawerProps({ showWarning, header }), [drawerHeaderProps])
  const parsedOptions = useMemo(
    () => getParsedDrawerOptions(defaultOptions, drawerOptions),
    [defaultOptions, drawerOptions]
  )

  const [showModal, hideModal] = useModalHook(
    () => (
      <>
        <Drawer {...parsedOptions}>
          <div className={css.formFullheight}>{createDrawerContent(drawerContentProps)}</div>
        </Drawer>
        <Button
          minimal
          style={parsedOptions?.size ? { right: parsedOptions?.size } : {}}
          className={css.almostFullScreenCloseBtn}
          icon="cross"
          withoutBoxShadow
          onClick={hideModal}
        />
      </>
    ),
    [drawerContentProps]
  )

  return {
    showDrawer: data => {
      if (data) {
        setDrawerContentProps(data)
      }
      showModal()
    },
    setDrawerHeaderProps: props => setDrawerHeaderProps(props),
    hideDrawer: hideModal
  }
}
