import type { Color } from '@wings-software/uicore'
import type { Template } from '@templates-library/components/AbstractTemplate/Template'

export class TemplateFactory {
  /**
   * Couples the factory with the templates it generates
   */
  protected templateBank: Map<string, Template<unknown>>

  constructor() {
    this.templateBank = new Map()
  }

  registerTemplate<T>(template: Template<T>): void {
    this.templateBank.set(template.getType(), template as Template<unknown>)
  }

  deregisterStep(type: string): void {
    const deletedTemplate = this.templateBank.get(type)
    if (deletedTemplate) {
      this.templateBank.delete(type)
    }
  }

  getTemplate<T>(type: string): Template<T> | undefined {
    return this.templateBank.get(type) as Template<T>
  }

  getTemplateName(type: string): string | undefined {
    return this.templateBank.get(type)?.getName()
  }

  getTemplateColor(type: string): Color | undefined {
    return this.templateBank.get(type)?.getColor()
  }
}
