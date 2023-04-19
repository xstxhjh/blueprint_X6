const { Graph, Edge, Shape, NodeView } = window.X6

const LINE_HEIGHT = 24
const NODE_WIDTH = 150

Graph.registerPortLayout(
  'erPortPosition',
  (portsPositionArgs) => {
    return portsPositionArgs.map((_, index) => {
      return {
        position: {
          x: 0,
          y: (index + 1) * LINE_HEIGHT,
        },
        angle: 0,
      }
    })
  },
  true,
)

Graph.registerNode(
  'er-rect',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      rect: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#5F95FF',
      },
      label: {
        fontWeight: 'bold',
        fill: '#ffffff',
        fontSize: 12,
      },
    },
    ports: {
      groups: {
        list: {
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody',
            },
            {
              tagName: 'text',
              selector: 'portNameLabel',
            },
            {
              tagName: 'text',
              selector: 'portTypeLabel',
            },
          ],
          attrs: {
            portBody: {
              width: NODE_WIDTH,
              height: LINE_HEIGHT,
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              magnet: true,
            },
            portNameLabel: {
              ref: 'portBody',
              refX: 6,
              refY: 6,
              fontSize: 10,
            },
            portTypeLabel: {
              ref: 'portBody',
              refX: 95,
              refY: 6,
              fontSize: 10,
            },
          },
          position: 'erPortPosition',
        },
      },
    },
  },
  true,
)

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
    magnetAvailable: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#47C769',
        },
      },
    },
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

const init = () => {
  const data = [
    {
      "id": "1",
      "shape": "er-rect",
      "label": "学生",
      "width": 150,
      "height": 24,
      "position": {
        "x": 24,
        "y": 150
      },
      "ports": [
        {
          "id": "1-1",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "ID"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "1-2",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Name"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "1-3",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Class"
            },
            "portTypeLabel": {
              "text": "NUMBER"
            }
          }
        },
        {
          "id": "1-4",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Gender"
            },
            "portTypeLabel": {
              "text": "BOOLEAN"
            }
          }
        }
      ]
    },
    {
      "id": "2",
      "shape": "er-rect",
      "label": "课程",
      "width": 150,
      "height": 24,
      "position": {
        "x": 250,
        "y": 210
      },
      "ports": [
        {
          "id": "2-1",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "ID"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "2-2",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Name"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "2-3",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "StudentID"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "2-4",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "TeacherID"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "2-5",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Description"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        }
      ]
    },
    {
      "id": "3",
      "shape": "er-rect",
      "label": "老师",
      "width": 150,
      "height": 24,
      "position": {
        "x": 480,
        "y": 350
      },
      "ports": [
        {
          "id": "3-1",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "ID"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "3-2",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Name"
            },
            "portTypeLabel": {
              "text": "STRING"
            }
          }
        },
        {
          "id": "3-3",
          "group": "list",
          "attrs": {
            "portNameLabel": {
              "text": "Age"
            },
            "portTypeLabel": {
              "text": "NUMBER"
            }
          }
        }
      ]
    },
    {
      "id": "4",
      "shape": "edge",
      "source": {
        "cell": "1",
        "port": "1-1"
      },
      "target": {
        "cell": "2",
        "port": "2-3"
      },
      "attrs": {
        "line": {
          "stroke": "#A2B1C3",
          "strokeWidth": 2
        }
      },
      "zIndex": 0
    },
    {
      "id": "5",
      "shape": "edge",
      "source": {
        "cell": "3",
        "port": "3-1"
      },
      "target": {
        "cell": "2",
        "port": "2-4"
      },
      "attrs": {
        "line": {
          "stroke": "#A2B1C3",
          "strokeWidth": 2
        }
      },
      "zIndex": 0
    }
  ]
  const cells = []
  data.forEach((item) => {
    if (item.shape === 'edge') {
      cells.push(graph.createEdge(item))
    } else {
      cells.push(graph.createNode(item))
    }
  })
  graph.resetCells(cells)
  graph.zoomToFit({ padding: 10, maxScale: 1 })
}

init()
