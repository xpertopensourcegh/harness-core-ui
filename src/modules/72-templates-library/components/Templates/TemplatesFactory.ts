import { TemplateFactory } from '@templates-library/components/AbstractTemplate/TemplateFactory'
import { StepTemplate } from '@templates-library/components/Templates/StepTemplate/StepTemplate'

const templateFactory = new TemplateFactory()

// common
templateFactory.registerTemplate(new StepTemplate())

// build steps
export default templateFactory
