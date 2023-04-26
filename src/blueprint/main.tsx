import { Graph, Edge, Shape, NodeView, Node, Cell } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { initGraph } from "./graph";
import "./main.css";

const LINE_HEIGHT = 36;
const NODE_WIDTH = 150;

const registerPortNode = () => {
  const CustomPortComponent = ({ node }: { node: Node }) => {
    return <div className="custom-port-node">dom A</div>;
  };

  const config = {
    keyName: "custom-port-node",
    shape: "custom-port-node",
    component: CustomPortComponent,
    width: NODE_WIDTH,
    height: LINE_HEIGHT,
		zIndex: 8,
    data: {
      disableMove: true,
    },
    attrs: {
      root: {
        magnet: false,
      },
      body: {
        fill: "#EFF4FF",
        stroke: "#EFF4FF",
        strokeWidth: 0,
      },
    },
    ports: {
      groups: {
        in: {
          position: {
            name: "left",
          },
          attrs: {
            portBody: {
              magnet: "passive",
              r: 4,
              stroke: "#5F95FF",
              fill: "#fff",
              strokeWidth: 1,
            },
          },
        },
        out: {
          position: {
            name: "right",
          },
          attrs: {
            portBody: {
              magnet: true,
              r: 4,
              fill: "#fff",
              stroke: "#5F95FF",
              strokeWidth: 1,
            },
          },
        },
      },
    },
    portMarkup: [
      {
        tagName: "circle",
        selector: "portBody",
      },
    ],
  };

  register({
    ...config,
  });
};

const registerGroupNode = () => {
  const CustomGroupComponent = ({ node }: { node: Node }) => {
    return <div className="custom-group-node">Title</div>;
  };

  const config = {
    keyName: "custom-group-node",
    shape: "custom-group-node",
    component: CustomGroupComponent,
    width: NODE_WIDTH,
    height: LINE_HEIGHT,
    zIndex: 8,
    attrs: {
      body: {
        fill: "#fffbe6",
        stroke: "#ffe7ba",
      },
    },
  };

  register({
    ...config,
  });
};

const initBluePrint = () => {
  const graph = initGraph();

  registerPortNode();

  registerGroupNode();

  function updateView(view: NodeView) {
    const cell = view.cell as any;
    if (cell === "custom-port-node") {
      cell.getInPorts().forEach((port: any) => {
        const portNode = view.findPortElem(port.id!, "portBody");
        view.unhighlight(portNode, {
          highlighter: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#fff",
                stroke: "#47C769",
              },
            },
          },
        });
      });
      cell.updateInPorts(graph);
    }
  }

  graph.on("edge:connected", ({ previousView, currentView }) => {
    if (previousView) {
      updateView(previousView as NodeView);
    }
    if (currentView) {
      updateView(currentView as NodeView);
    }
  });

  graph.on("edge:removed", ({ edge, options }) => {
    if (!options.ui) {
      return;
    }

    const target = edge.getTargetCell() as any;
    if (target && target.keyName === "custom-port-node") {
      target.updateInPorts(graph);
    }
  });

  graph.on("edge:mouseenter", ({ edge }) => {
    edge.addTools([
      "source-arrowhead",
      "target-arrowhead",
      {
        name: "button-remove",
        args: {
          distance: -30,
        },
      },
    ]);
  });

  graph.on("edge:mouseleave", ({ edge }) => {
    edge.removeTools();
  });

  const createPortNode = (x: number, y: number, opt: { ports: string[] }) => {
    // const node = new MyShape()
    // node.resize(NODE_WIDTH, LINE_HEIGHT).position(x, y).updateInPorts(graph)
    // graph.addNode(node)

    const node = graph.addNode({
      x: x,
      y: y,
      shape: "custom-port-node",
    }) as any;

    opt.ports.map(name=>{
			node.addPort({
				group: name
			})
		})
		
    node.getInPorts = function () {
      return this.getPortsByGroup("in");
    };

    node.getOutPorts = function () {
      return this.getPortsByGroup("out");
    };

    node.getUsedInPorts = function (graph: Graph) {
      const incomingEdges = graph.getIncomingEdges(this) || [];
      return incomingEdges.map((edge: Edge) => {
        const portId = edge.getTargetPortId();
        return this.getPort(portId!);
      });
    };

    node.getNewInPorts = function (length: number) {
      return Array.from(
        {
          length,
        },
        () => {
          return {
            group: "in",
          };
        }
      );
    };

    node.updateInPorts = function (graph: Graph) {
      const minNumberOfPorts = 1;
      const ports = this.getInPorts();
      const usedPorts = this.getUsedInPorts(graph);
      const newPorts = this.getNewInPorts(
        Math.max(minNumberOfPorts - usedPorts.length, 1)
      );

      if (
        ports.length === minNumberOfPorts &&
        ports.length - usedPorts.length > 0
      ) {
        // noop
      } else if (ports.length === usedPorts.length) {
        this.addPorts(newPorts);
      } else if (ports.length + 1 > usedPorts.length) {
        this.prop(
          ["ports", "items"],
          this.getOutPorts().concat(usedPorts).concat(newPorts),
          {
            rewrite: true,
          }
        );
      }

      return this;
    };

    return node;
  };

  const createNodeGroup = (x = 80, y = 40, data: any) => {
    const parent = graph.addNode({
      x: x,
      y: y,	
      shape: "custom-group-node",
    }) as any;

    data.map((item: any, index: number) => {
			console.log(item)
      const child = createPortNode(x, y + LINE_HEIGHT * (index + 1), {ports: [item]});
      parent.addChild(child);
    });

    parent.resize(NODE_WIDTH, LINE_HEIGHT * (data.length + 1));
  };
  createNodeGroup(80, 40,['out', 'out','out']);
  createNodeGroup(300, 40,['in', 'in','in']);

  return {
    createPortNode,
  };
};

export { initBluePrint };
