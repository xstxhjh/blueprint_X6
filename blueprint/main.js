const { Graph, Edge, Shape, NodeView } = window.X6

import { graph } from './graph.js'

// 定义节点
class MyShape extends Shape.Rect {
  constructor(props) {
    super(props)
    this.keyName = 'MyShape'
  }

  getInPorts() {
    return this.getPortsByGroup('in')
  }

  getOutPorts() {
    return this.getPortsByGroup('out')
  }

  getUsedInPorts(graph) {
    const incomingEdges = graph.getIncomingEdges(this) || []
    return incomingEdges.map((edge) => {
      const portId = edge.getTargetPortId()
      return this.getPort(portId)
    })
  }

  getNewInPorts(length) {
    return Array.from(
      {
        length,
      },
      () => {
        return {
          group: 'in',
        }
      },
    )
  }

  updateInPorts(graph) {
    const minNumberOfPorts = 2
    const ports = this.getInPorts()
    const usedPorts = this.getUsedInPorts(graph)
    const newPorts = this.getNewInPorts(
      Math.max(minNumberOfPorts - usedPorts.length, 1),
    )

    if (
      ports.length === minNumberOfPorts &&
      ports.length - usedPorts.length > 0
    ) {
      // noop
    } else if (ports.length === usedPorts.length) {
      this.addPorts(newPorts)
    } else if (ports.length + 1 > usedPorts.length) {
      this.prop(
        ['ports', 'items'],
        this.getOutPorts().concat(usedPorts).concat(newPorts),
        {
          rewrite: true,
        },
      )
    }

    return this
  }
}

MyShape.config({
  label: 'hahaha',
  data: {
    disableMove: true
  },
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: '#EFF4FF',
      stroke: '#5F95FF',
      strokeWidth: 1,
    },
  },
  ports: {
    items: [  // 链接桩
      {
        group: 'out',
      },
    ],
    groups: { // 链接桩组定义
      in: {
        position: {
          name: 'right',
        },
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 4,
            stroke: '#5F95FF',
            fill: '#fff',
            strokeWidth: 1,
          },
        },
      },
      out: {
        position: {
          name: 'left',
        },
        attrs: {
          portBody: {
            magnet: true,  // 链接桩在连线交互时可以被连接上
            r: 4,
            fill: '#fff',
            stroke: '#5F95FF',
            strokeWidth: 1,
          },
        },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
})

function updateView(view) {
  const cell = view.cell
  if (cell instanceof MyShape) {
    cell.getInPorts().forEach((port) => {
      const portNode = view.findPortElem(port.id, 'portBody')
      view.unhighlight(portNode, {
        highlighter: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#47C769',
            },
          },
        },
      })
    })
    cell.updateInPorts(graph)
  }
}

graph.on('edge:connected', ({ previousView, currentView }) => {
  if (previousView) {
    updateView(previousView)
  }
  if (currentView) {
    updateView(currentView)
  }
})

graph.on('edge:removed', ({ edge, options }) => {
  if (!options.ui) {
    return
  }

  const target = edge.getTargetCell()
  if (target instanceof MyShape) {
    target.updateInPorts(graph)
  }
})

graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    'source-arrowhead',
    'target-arrowhead',
    {
      name: 'button-remove',
      args: {
        distance: -30,
      },
    },
  ])
})

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools()
})



const parent = graph.addNode({
  x: 80,
  y: 40,
  width: 320,
  height: 340,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
})

const node = new MyShape()
node.resize(120, 240).position(200, 50).updateInPorts(graph)
// graph.addNode(node)
parent.addChild(node)

graph.addNode(
  new MyShape().resize(120, 360).position(400, 50).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 360).position(300, 250).updateInPorts(graph),
)


export { MyShape }