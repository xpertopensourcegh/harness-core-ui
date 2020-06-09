import { DefaultNodeModelOptions, DefaultNodeModel } from '../DefaultNodeModel'
import { DiagramType } from '../../Constants'
import i18n from '../../Diagram.i18n'

export interface DiamondNodeModelOptions extends Omit<DefaultNodeModelOptions, 'secondaryIcon' | 'name'> {
  name?: string
}

export class DiamondNodeModel extends DefaultNodeModel {
  constructor(options?: DiamondNodeModelOptions) {
    super({
      type: DiagramType.DiamondNode,
      name: i18n.Approve,
      icon: 'add',
      backgroundColor: 'var(--white)',
      ...options
    })
  }
}
