const { Graph, Edge, Shape, NodeView } = window.X6

// 定义节点
class MyShape extends Shape.Rect {
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

// 高亮
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {
      fill: '#fff',
      stroke: '#47C769',
    },
  },
}

// 画布
const graph = new Graph({
  container: document.getElementById('container'),
  clipboard: true,  // 剪切板
  background: {
    color: '#fffbe6', // 设置画布背景颜色
  },
  grid: {
    size: 10,      // 网格大小 10px
    visible: true, // 渲染网格背景
  },
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
        },
      },
    },
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    highlight: true,
    connector: 'rounded',
    connectionPoint: 'boundary',
    router: {
      name: 'er',
      args: {
        direction: 'V',
      },
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              size: 7,
            },
          },
        },
      })
    },
    validateConnection({ sourceView, targetView, targetMagnet }) {
      if (!targetMagnet) {
        return false
      }

      if (targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      if (targetView) {
        const node = targetView.cell
        if (node instanceof MyShape) {
          const portId = targetMagnet.getAttribute('port')
          const usedInPorts = node.getUsedInPorts(graph)
          if (usedInPorts.find((port) => port && port.id === portId)) {
            return false
          }
        }
      }

      return true
    },
  },
})

graph.addNode(
  new MyShape().resize(120, 240).position(200, 50).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 360).position(400, 50).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 360).position(300, 250).updateInPorts(graph),
)

function update(view) {
  const cell = view.cell
  if (cell instanceof MyShape) {
    cell.getInPorts().forEach((port) => {
      const portNode = view.findPortElem(port.id, 'portBody')
      view.unhighlight(portNode, {
        highlighter: magnetAvailabilityHighlighter,
      })
    })
    cell.updateInPorts(graph)
  }
}

graph.on('edge:connected', ({ previousView, currentView }) => {
  if (previousView) {
    update(previousView)
  }
  if (currentView) {
    update(currentView)
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