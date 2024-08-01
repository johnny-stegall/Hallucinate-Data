import * as D3 from "d3";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	edges:
	{
		areDirectional: false,
		colorPalette: "#999",
		groupProperty: "group",
		idProperty: "id",
		labelProperty: "key",
		labels: "none",
		lineStyle: "straight",
		lineWidth: 1,
		sourceProperty: "source",
		targetProperty: "target",
		valueProperty: "value"
	},
	labels:
	{
		fillColor: "#fff",
		fontFamily: "Arial, Helvitica, Sans-Serif",
		fontSize: 10,
		strokeColor: "#333",
		strokeWidth: 0.25
	},
	nodes:
	{
		colorPalette: "schemeCategory10",
		groupProperty: "group",
		idProperty: "id",
		labelProperty: "key",
		labels: "tooltip",
		radius: 5,
		valueProperty: "value"
	},
	useCenteringForce: true,
	usePositionalForce: false
});

/******************************************************************************
* A visualization consisting of nodes connected by edges.
******************************************************************************/
export default class ForceGraph extends IVisualization
{
	/******************************************************************************
	* Gets the defaults.
	*
	* @returns {object} The visualization defaults.
	******************************************************************************/
	static get defaults()
	{
		return { ...super.defaults, ...DEFAULTS };
	}

	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "force-graph.json";
	}

	/****************************************************************************
	* Draws a graph of nodes and edges.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static async draw(data, visual)
	{
		const merged = super.applyDefaults(visual, this.defaults);
		merged.edges = { ...DEFAULTS.edges, ...visual?.edges };
		merged.labels = { ...DEFAULTS.labels, ...visual?.labels };
		merged.nodes = { ...DEFAULTS.nodes, ...visual?.nodes };
		visual = merged;

		// D3 requires edges to have source and target properties
		this.#renameSourceAndTargetEdgeProperties(data, visual);

		let isSimulationFinished = false;

		// Create the color palettes
		const edgeColors = this.getColorPalette(data.edges.map(edge => edge[visual.edges.groupProperty]), visual.edges.colorPalette);
		const nodeColors = this.getColorPalette(data.nodes.map(node => node[visual.nodes.groupProperty]), visual.nodes.colorPalette);
	
		// Create the SVG container
		const svg = this.constructSvg(visual, nodeColors);

		const edgeElements = this.#drawEdges(svg, data.edges, visual, edgeColors);
		const nodeElements = this.#drawNodes(svg, data.nodes, visual, nodeColors);
		
		// Create a simulation with several forces
		const simulation = D3.forceSimulation(data.nodes)
			.force("edge", D3.forceLink(data.edges)
				.id(node => node[visual.nodes.idProperty])
				.strength(edge => edge[visual.edges.strength] ?? 0.2))
			.force("charge", D3.forceManyBody());

		// Centering force applies gravitational force at the center
		if (visual.useCenteringForce)
			simulation.force("center", D3.forceCenter(visual.width / 2, visual.height / 2));

		// Positional force allows for disjointed (or multiple disconnected) graphs
		// in the same visualization
		if (visual.usePositionalForce)
		{
			simulation
				.force("x", D3.forceX())
				.force("y", D3.forceY());
		}

		simulation
			.on("end", () => (isSimulationFinished = true))
			.on("tick", () => this.#moveNodesAndEdges(visual, nodeElements, edgeElements));

		// Wait for the simulation to finish before returning the SVG
		while (!isSimulationFinished)
			await new Promise(resolve => setTimeout(resolve, 250));

		simulation.stop();
		return svg.node().outerHTML;
	}

	/******************************************************************************
	* Draws edges on a force graph.
	*
	* @param {HTMLElement} svg The SVG container element.
	* @param {Array} edges The edges.
	* @param {object} visual The visualization settings.
	* @param {*} edgeColors The color palette for the edges.
	* @returns {object} The d3 reference to the edge elements.
	******************************************************************************/
	static #drawEdges(svg, edges, visual, edgeColors)
	{
		if (visual.edges.areDirectional)
		{
			// Define an arrow for each distinct group that can be placed at the end
			// of edges. Attributes refX and refY move the arrow tip to the end of the
			// edge.
			const distinctGroups = Array.from(new Set(edges.map(edge => edge[visual.edges.groupProperty])));
			svg.append("defs")
				.selectAll("marker")
				.data(distinctGroups)
				.join("marker")
					.attr("id", group => `arrow-${group}`)
					.attr("viewBox", "0 -5 10 10")
					.attr("refX", 18)
					.attr("refY", 0)
					.attr("markerWidth", 6)
					.attr("markerHeight", 6)
					.attr("orient", "auto")
					.append("path")
						.attr("fill", group => edgeColors(group))
						.attr("d", "M0,-5L10,0L0,5");
		}
		
		const edgeElements = svg.append("g")
			.selectAll("g")
			.data(edges)
			.join("g");

		edgeElements.append("path")
			.attr("id", edge => edge[visual.edges.idProperty])
			.attr("stroke", edge => edgeColors(edge[visual.edges.groupProperty]))
			.attr("stroke-width", edge => visual.edges.lineWidth + (edge[visual.edges.valueProperty] ?? 0))
			.attr("marker-start", edge => (visual.edges.areDirectional && edge.isBidirectional) ? `url(${`#arrow-${edge[visual.edges.groupProperty]}`})` : null)
			.attr("marker-end", edge => visual.edges.areDirectional ? `url(${`#arrow-${edge[visual.edges.groupProperty]}`})` : null);

		// Add a label or a tooltip
		if (visual.edges.labels.toLowerCase() === "text")
		{
			edgeElements.append("text")
				.attr("style", "text-anchor: middle;")
				.attr("dy", "0.3em")
				.attr("font", visual.labels.fontFamily)
				.attr("font-size", visual.labels.fontSize)
				.attr("stroke", "#fff")
				.attr("stroke-width", "0.6em")
				.append("textPath")
					.attr("href", edge => `#${edge.internalId}`)
					.attr("startOffset", "50%")
					.text(edge => edge[visual.edges.labelProperty])

			edgeElements.append("text")
				.attr("style", "text-anchor: middle;")
				.attr("dy", (visual.labels.fontSize / 2) - 2)
				.attr("fill", visual.labels.fillColor)
				.attr("font", visual.labels.fontFamily)
				.attr("font-size", visual.labels.fontSize)
				.attr("stroke", visual.labels.strokeColor)
				.attr("stroke-width", visual.labels.strokeWidth)
				.append("textPath")
					.attr("href", edge => `#${edge.internalId}`)
					.attr("startOffset", "50%")
					.text(edge => edge[visual.edges.labelProperty]);
		}
		else if (visual.edges.labels.toLowerCase() === "tooltip")
		{
			edgeElements.append("title")
				.text(edge => edge[visual.edges.labelProperty]);
		}

		return edgeElements;
	}

	/******************************************************************************
	* Draws nodes on a force graph.
	*
	* @param {HTMLElement} svg The SVG container element.
	* @param {Array} nodes The nodes.
	* @param {object} visual The visualization settings.
	* @param {*} edgeColors The color palette for the edges.
	* @returns {object} The d3 reference to the node elements.
	******************************************************************************/
	static #drawNodes(svg, nodes, visual, nodeColors)
	{
		// Draw a circle for each node
		const nodeElements = svg.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.attr("stroke-linecap", "round")
			.attr("stroke-linejoin", "round")
			.selectAll("g")
			.data(nodes)
			.join("g");

		nodeElements.append("circle")
			.attr("id", node => node[visual.nodes.idProperty])
			.attr("r", node => visual.nodes.radius + (node[visual.nodes.valueProperty] ?? 0))
			.attr("fill", node => nodeColors(node[visual.nodes.groupProperty]));

		// Add a label or a tooltip
		if (visual.nodes.labels.toLowerCase() === "text")
		{
			// If the nodes are large enough to accomodate text, place the labels
			// inside the nodes, otherwise place them outside the nodes
			if (visual.nodes.radius * 2 >= visual.labels.fontSize * 8)
			{
				nodeElements.append("text")
					.attr("style", "text-anchor: middle;")
					.attr("fill", visual.labels.fillColor)
					.attr("font", visual.labels.fontFamily)
					.attr("font-size", visual.labels.fontSize)
					.attr("stroke", visual.labels.strokeColor)
					.attr("stroke-width", visual.labels.strokeWidth)
					.attr("x", (node, index, element) => nodeElements._groups[0][index].querySelector("circle").cx)
					.attr("y", (node, index, element) => nodeElements._groups[0][index].querySelector("circle").cy)
					.attr("dy", "0.3em")
					.attr("textLength", (node, index, element) => (nodeElements._groups[0][index].querySelector("circle").r * 2) * .9)
					.attr("lengthAdjust", "spacingAndGlyphs")
					.text(node => node[visual.nodes.labelProperty]);
			}
			else
			{
				nodeElements.append("text")
					.attr("fill", visual.labels.fillColor)
					.attr("font", visual.labels.fontFamily)
					.attr("font-size", visual.labels.fontSize)
					.attr("stroke", visual.labels.strokeColor)
					.attr("stroke-width", visual.labels.strokeWidth)
					.attr("x", visual.nodes.radius)
					.attr("y", "-0.5em")
					.text(node => node[visual.nodes.labelProperty]);
			}
		}
		else if (visual.nodes.labels.toLowerCase() === "tooltip")
		{
			nodeElements.append("title")
				.text(node => node[visual.nodes.labelProperty]);
		}

		return nodeElements;
	}
	
	/******************************************************************************
	* Moves nodes and edges during a force graph simulation.
	*
	* @param {object} visual The visualization settings.
	* @param {object[]} nodeElements The node elements.
	* @param {object[]} edgeElements The edge elements.
	******************************************************************************/
	static #moveNodesAndEdges(visual, nodeElements, edgeElements)
	{
		if (visual.edges.lineStyle.toLowerCase() === "arc")
			{
				edgeElements.selectAll("path")
					.attr("fill", "none")
					.attr("d", edge =>
					{
						const radius = Math.hypot(edge.target.x - edge.source.x, edge.target.y - edge.source.y);
						return `M${edge.source.x},${edge.source.y} A${radius},${radius} 0 0,1 ${edge.target.x},${edge.target.y}`;
					});

				nodeElements.attr("transform", node => `translate(${node.x},${node.y})`);
			}
			else
			{
				edgeElements.selectAll("path")
					.attr("d", edge => `M${edge.source.x},${edge.source.y} L${edge.target.x},${edge.target.y}`);

				nodeElements.attr("transform", node => `translate(${node.x},${node.y})`);
			}
	}

	/******************************************************************************
	* D3 requires edges (links) to have source and target properties. The data has
	* different names, so rename them to match D3's requirements.
	*
	* @param {object} data The data to visualize.
	* @param {object} visual The visualization settings.
	******************************************************************************/
	static #renameSourceAndTargetEdgeProperties(data, visual)
	{
		if (visual.edges.sourceProperty !== "source")
		{
			data.edges.forEach(edge =>
			{
				edge.source = edge[visual.edges.sourceProperty];
				delete edge[visual.edges.sourceProperty];
			});
		}

		if (visual.edges.targetProperty !== "target")
		{
			data.edges.forEach(edge =>
			{
				edge.target = edge[visual.edges.targetProperty];
				delete edge[visual.edges.targetProperty];
			});
		}
	}
};