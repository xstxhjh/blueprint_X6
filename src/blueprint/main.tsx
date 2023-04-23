import { Graph, Edge, Shape, NodeView, Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'

import { initGraph } from './graph'

const LINE_HEIGHT = 24
const NODE_WIDTH = 150

const CustomComponent = ({ node }: { node: Node }) => {
	return (
		<div className="custom-react-node">hahaha</div>
	)
}

const initBluePrint = () => {
	const graph = initGraph()

	const config = {
		keyName: 'custom-react-node',
		shape: 'custom-react-node',
		component: CustomComponent,
		width: NODE_WIDTH,
		height: LINE_HEIGHT,
		// data: {
		// 	disableMove: true
		// },
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
			items: [
				{
					group: 'out',
				},
			],
			groups: {
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
							magnet: true,
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
	}

	register({
		...config
	})

	function updateView(view: NodeView) {
		const cell = view.cell as any
		if (cell === 'custom-react-node') {
			cell.getInPorts().forEach((port: any) => {
				const portNode = view.findPortElem(port.id!, 'portBody')
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
			updateView(previousView as NodeView)
		}
		if (currentView) {
			updateView(currentView as NodeView)
		}
	})

	graph.on('edge:removed', ({ edge, options }) => {
		if (!options.ui) {
			return
		}

		const target = edge.getTargetCell() as any
		if (target && target.keyName === 'custom-react-node') {
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

	const createBox = (x = 80, y = 40) => {

		// const node = new MyShape()
		// node.resize(NODE_WIDTH, LINE_HEIGHT).position(x, y).updateInPorts(graph)
		// graph.addNode(node)


		const node = graph.addNode({
			x: 120,
			y: 50,
			shape: 'custom-react-node',
		}) as any

		node.getInPorts = function () {
			return this.getPortsByGroup('in')
		}

		node.getOutPorts = function () {
			return this.getPortsByGroup('out')
		}

		node.getUsedInPorts = function (graph: Graph) {
			const incomingEdges = graph.getIncomingEdges(this) || []
			return incomingEdges.map((edge: Edge) => {
				const portId = edge.getTargetPortId()
				return this.getPort(portId!)
			})
		}

		node.getNewInPorts = function (length: number) {
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

		node.updateInPorts = function (graph: Graph) {
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
		console.log(node)
	}

	createBox()

	return {
		createBox
	}
}


export { initBluePrint }