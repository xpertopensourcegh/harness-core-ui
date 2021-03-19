import type { ReactNode } from 'react'
import { Toaster, Position, IToaster, Intent } from '@blueprintjs/core'
import css from './useToaster.module.scss'

const toaster = Toaster.create({
  className: css.toaster,
  position: Position.TOP
})

export interface ToasterProps extends IToaster {
  showSuccess: (message: string | ReactNode, timeout?: number) => void
  showError: (message: string | ReactNode, timeout?: number) => void
  showWarning: (message: string) => void
}

const showSuccess = (message: string | ReactNode, timeout?: number): void => {
  toaster.show({ message, intent: Intent.SUCCESS, icon: 'tick', timeout })
}

const showError = (message: string | ReactNode, timeout?: number): void => {
  toaster.show({ message, intent: Intent.DANGER, icon: 'error', timeout })
}

const showWarning = (message: string): void => {
  toaster.show({ message, intent: Intent.WARNING, icon: 'warning-sign' })
}

export function useToaster(): ToasterProps {
  // useEffect(() => {
  //   return () => {
  //     toaster.clear()
  //   }
  // }, [])

  return {
    ...toaster,
    showSuccess,
    showError,
    showWarning,
    clear: () => {
      toaster.clear()
    }
  }
}
