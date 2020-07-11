import React, { useState, useEffect } from 'react'
import { Prompt } from 'react-router-dom'
import type * as History from 'history'
import { useConfirmationDialog } from '../../modals/ConfirmDialog/useConfirmationDialog'
import i18n from './NavigationCheck.i18n'

interface Props {
  when?: boolean
  navigate: (path: string) => void
  shouldBlockNavigation?: (location: History.Location) => boolean
}
export const NavigationCheck = ({ when, navigate, shouldBlockNavigation }: Props): JSX.Element => {
  const [lastLocation, setLastLocation] = useState<History.Location | null>(null)
  const [confirmedNavigation, setConfirmedNavigation] = useState(false)

  const handleBlockedNavigation = (nextLocation: History.Location): string | boolean => {
    if (!confirmedNavigation) {
      if (!shouldBlockNavigation || (shouldBlockNavigation && shouldBlockNavigation(nextLocation))) {
        openDialog()
        setLastLocation(nextLocation)
        return false
      }
    }
    return true
  }

  const handleConfirmNavigationClick = (): void => {
    setConfirmedNavigation(true)
  }

  const { openDialog } = useConfirmationDialog({
    cancelButtonText: i18n.close,
    contentText: i18n.navigationCheckText,
    titleText: i18n.navigationCheckTitle,
    confirmButtonText: i18n.navigationConfirm,
    onCloseDialog: isConfirmed => {
      if (isConfirmed) {
        handleConfirmNavigationClick()
      }
    }
  })

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(lastLocation.pathname)
    }
  }, [navigate, confirmedNavigation, lastLocation])

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
    </>
  )
}
