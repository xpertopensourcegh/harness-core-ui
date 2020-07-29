import { Toaster, Position, IToaster, Intent } from '@blueprintjs/core'
import css from './useToaster.module.scss'

const toaster = Toaster.create({
  className: css.toaster,
  position: Position.TOP
})

export interface ToasterProps extends IToaster {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
}

const showSuccess = (message: string): void => {
  toaster.show({ message, intent: Intent.SUCCESS, icon: 'tick' })
}

const showError = (message: string): void => {
  toaster.show({ message, intent: Intent.DANGER, icon: 'error' })
}

const showWarning = (message: string): void => {
  toaster.show({ message, intent: Intent.WARNING, icon: 'warning-sign' })
}

export function useToaster(): ToasterProps {
  return {
    ...toaster,
    showSuccess,
    showError,
    showWarning
  }
}
