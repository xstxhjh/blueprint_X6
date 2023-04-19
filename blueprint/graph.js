const { Graph, Shape } = window.X6

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
      name: 'metro',
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
				console.log(node.keyName)
        if (node.keyName === 'keyName') {
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
	// translating: {
	// 	restrict(view) {
	// 		const cell = view.cell
	// 		if (cell.isNode()) {
	// 			const parent = cell.getParent()
	// 			if (parent) {
	// 				console.log(parent.getBBox())
	// 				return parent.getBBox()
	// 			}
	// 		}

	// 		return null
	// 	},
	// },
	interacting: function (cellView){
    console.log('cellView:', cellView.cell.getData())
    if(cellView.cell.getData() != undefined && cellView.cell.getData().disableMove){
      return { nodeMovable: false }
    }
    return true
	}
})
 

export {
	graph
}