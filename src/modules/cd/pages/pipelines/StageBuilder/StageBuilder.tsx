import React from 'react'
import { Diagram } from 'modules/common/exports'
import css from './StageBuilder.module.scss'
import { StageBuilderModel, GraphObj } from './StageBuilderModel'
import { ContextMenu } from '@blueprintjs/core'

export const StageBuilder = (): JSX.Element => {
  const [data] = React.useState<GraphObj[]>([])
  const [isOpen, setPopover] = React.useState(false)

  const refDom = React.useRef<HTMLDivElement | null>(null)

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new StageBuilderModel(), [])

  // renderParallelNodes(model)
  model.addUpdateGraph(data)

  const nodes = model.getActiveNodeLayer().getNodes()
  for (const key in nodes) {
    const node = nodes[key]
    node.registerListener({
      [Diagram.Event.SelectionChanged]: (event: any) => {
        const eventTemp = event as Diagram.DefaultNodeEvent
        const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
        if (nodeRender && eventTemp.isSelected) {
          ContextMenu.show(<div>Test</div>, {
            left: nodeRender.getBoundingClientRect().x,
            top: nodeRender.getBoundingClientRect().y
          })
        }
      }
    })
  }

  // load model into engine
  engine.setModel(model)

  return (
    <div
      className={css.canvas}
      onClick={e => {
        const div = e.target as HTMLDivElement
        if (div.className?.indexOf?.('CanvasWidget-module_canvas') > -1 && isOpen) {
          setPopover(false)
        }
      }}
    >
      <Diagram.CanvasWidget engine={engine} />
      <div ref={refDom} className={css.hiddenDom} style={{ visibility: isOpen ? 'initial' : 'hidden' }}>
        Content
      </div>
    </div>
  )
}
