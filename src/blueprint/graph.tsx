import { Graph, Shape } from '@antv/x6'

const initGraph = ()=> {
// 画布
const graph = new Graph({
  container: document.getElementById('container') as any,
  background: {
    color: '#fff', // 设置画布背景颜色
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
    snap: true, // 吸附
    allowBlank: false,  // 连接空白节点
    allowLoop: false, // 同一循环节点
    allowMulti: 'withPort', // 创建多个边
    allowNode: false, // 连接节点
    allowEdge: false, // 连接边
    allowPort: true, // 连接桩
    highlight: true,  // 
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
    validateConnection({ sourceView, targetView, targetMagnet }: any) {
      if (!targetMagnet) {
        return false
      }

      // 入口禁止创建连线
      if (targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      if (targetView) {
        // 禁止修改入口的线
        const node = targetView.cell
        const portId = targetMagnet.getAttribute('port')
        const usedInPorts = node.getUsedInPorts(graph)
        if (usedInPorts.find((port: { id: any }) => port && port.id === portId)) {
          return false
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
	interacting: function (cellView: any){
    let opt: any = {
    }
    if(cellView.cell.getData() != undefined && cellView.cell.getData().disableMove){
      opt.nodeMovable = false
    }
    
    return opt
	}
})
	return graph
}


export {
	initGraph
}