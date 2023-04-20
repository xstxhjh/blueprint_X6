const { Edge, Shape, Node } = window.X6
import { graph } from './graph.js'

const LINE_HEIGHT = 24
const NODE_WIDTH = 150

// 定义节点
class MyShape extends Shape.HTML {
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
    const minNumberOfPorts = 1
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
  data: {
    disableMove: true
  },
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: '#EFF4FF',
      stroke: '#EFF4FF',
      strokeWidth: 0,
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
          name: 'left',
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
          name: 'right',
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



const createBox = (x = 80, y = 40)=>{
  const strokeWidth = 1;
  const parent = graph.addNode({
    x: x,
    y: y,
    width: NODE_WIDTH,
    height: LINE_HEIGHT * 3,
    // attrs: { 
    //   body: {
    //     fill: '#2ECC71', // 背景颜色
    //     stroke: '#000',  // 边框颜色
    //     strokeWidth: strokeWidth,
    //   },
    //   text: {
    //     text: 'this is content text',
    //     refY: 13,
    //     fill: '#333',    // 文字颜色
    //     fontSize: 13,    // 文字大小
    //   },
    // },
    shape: 'html',
    html: {
      render(node) {
        const wrap = document.createElement('div')
        wrap.style.width = '100%'
        wrap.style.height = '100%'
        wrap.style.background = '#f0f0f0'
        wrap.style.display = 'flex'
        wrap.style.justifyContent = 'center'
        wrap.style.alignItems = 'center'
    
        wrap.innerText = 'Hello'
        return wrap
      },
      shouldComponentUpdate(node) {
        return true
      }
    },
  })
  
  const node = new MyShape()
  node.resize(NODE_WIDTH - strokeWidth * 2, LINE_HEIGHT).position(x + strokeWidth, y + LINE_HEIGHT).updateInPorts(graph)
  console.log(node.html)
  node.id = 10
  graph.addNode(node)
  parent.addChild(node)
  console.log(node)

  node.attr("body/html", "<div class='test-html'>hahhahahaah</div>");
}

createBox()

export { MyShape }