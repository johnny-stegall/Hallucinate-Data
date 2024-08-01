import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import ForceGraph from "../source/shared/Visualizations/ForceGraph.js";

test.beforeEach("Load data", async t =>
{
	t.context.disjointedGraph = JSON.parse(await Fs.readFile("tests/data/disjointed-graph.json"));
	t.context.phylogeneticTreeBidirectional = JSON.parse(await Fs.readFile("tests/data/phylogenetic-tree-phylums-bi-directional.json"));
	t.context.phylogeneticTree = JSON.parse(await Fs.readFile("tests/data/phylogenetic-tree-phylums.json"));
	t.context.phylogeneticTreeReversed = JSON.parse(await Fs.readFile("tests/data/phylogenetic-tree-phylums-reversed.json"));
});

test("Force graph", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/defaults.svg";
	const data = { nodes: Array.from(t.context.phylogeneticTree.nodes), edges: Array.from(t.context.phylogeneticTree.edges, edge =>
	{
		const newEdge = { ...edge, label: edge.relationship };
		delete newEdge.label;
		return newEdge;
	})};
	
	// Act
	const svg = await ForceGraph.draw(data);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph useCenteringForce and usePositionalForce properties function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/disjointed-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/disjointed.svg";

	// Act
	const svg = await ForceGraph.draw(t.context.disjointedGraph, { nodes: { labelProperty: "id" }, useCenteringForce: false, usePositionalForce: true });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph edge areDirectional property works as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/directional-edges-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/directional-edges.svg";
	const graphSettings =
	{
		edges:
		{
			areDirectional: true,
			labels: "text",
			labelProperty: "relationship"
		},
		nodes:
		{
			labels: "text",
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTreeReversed, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const markerElements = svgDom.window.document.querySelectorAll("svg > marker").length;
	const expectedMarketElements = EXPECTED_DOM.window.document.querySelectorAll("svg > marker").length;
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(markerElements.length, expectedMarketElements.length);
});

test("Force graph edge areDirectional and isBidirectional properties work as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/bi-directional-edges-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/bi-directional-edges.svg";
	const graphSettings =
	{
		edges:
		{
			areDirectional: true,
			labels: "text",
			labelProperty: "relationship"
		},
		nodes:
		{
			labels: "text",
			labelProperty: "name"
		}
	};
	const data = { nodes: Array.from(t.context.phylogeneticTreeBidirectional.nodes), edges: Array.from(t.context.phylogeneticTreeBidirectional.edges, edge =>
	{
		const newEdge = { ...edge, isBidirectional: true };
		return newEdge;
	})};

	// Act
	const svg = await ForceGraph.draw(data, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const markerElements = svgDom.window.document.querySelectorAll("svg > marker").length;
	const expectedMarketElements = EXPECTED_DOM.window.document.querySelectorAll("svg > marker").length;
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(markerElements.length, expectedMarketElements.length);
});

test("Force graph edge idProperty property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-id-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-id-property.svg";
	const data = { nodes: Array.from(t.context.phylogeneticTree.nodes), edges: Array.from(t.context.phylogeneticTree.edges, edge =>
	{
		const newEdge = { ...edge, edgeId: edge.id };
		delete newEdge.id;
		return newEdge;
	})};
	
	// Act
	const svg = await ForceGraph.draw(data, { edges: { idProperty: "edgeId", labelProperty: "relationship" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph edge labelProperty property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-label-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph edge labels property = tooltips functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-tooltip-labels-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-tooltip-labels.svg";
	const graphSettings =
	{
		edges:
		{
			labels: "tooltip",
			labelProperty: "relationship"
		},
		nodes:
		{
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const titleElements = svgDom.window.document.querySelectorAll("svg > title").length;
	const expectedTitleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > title").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(titleElements.length, expectedTitleElements.length);
});

test("Force graph edge labels property = text functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-text-labels-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-text-labels.svg";
	const graphSettings =
	{
		edges:
		{
			labels: "text",
			labelProperty: "relationship"
		},
		nodes:
		{
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const textElements = svgDom.window.document.querySelectorAll("svg > text").length;
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(textElements.length, expectedTextElements.length);
});

test("Force graph edge lineStyle property = arc functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/arc-edges-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/arc-edges.svg";

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { lineStyle: "arc" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph edge lineStyle and areDirectional properties function together as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/arc-directional-edges-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/arc-directional-edges.svg";
	const graphSettings =
	{
		edges:
		{
			areDirectional: true,
			lineStyle: "arc"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTreeReversed, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const markerElements = svgDom.window.document.querySelectorAll("svg > marker").length;
	const expectedMarketElements = EXPECTED_DOM.window.document.querySelectorAll("svg > marker").length;
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(markerElements.length, expectedMarketElements.length);
});

test("Force graph edge lineStyle, areDirectional, and isBidirectional properties function together as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/arc-bi-directional-edges-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/arc-bi-directional-edges.svg";
	const data = { nodes: Array.from(t.context.phylogeneticTreeBidirectional.nodes), edges: Array.from(t.context.phylogeneticTreeBidirectional.edges, edge =>
	{
		const newEdge = { ...edge, isBidirectional: true };
		return newEdge;
	})};
	const graphSettings =
	{
		edges:
		{
			areDirectional: true,
			lineStyle: "arc"
		}
	};

	// Act
	const svg = await ForceGraph.draw(data, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const markerElements = svgDom.window.document.querySelectorAll("svg > marker").length;
	const expectedMarketElements = EXPECTED_DOM.window.document.querySelectorAll("svg > marker").length;
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(markerElements.length, expectedMarketElements.length);
});

test("Force graph edge lineWidth property functions as expected", async t =>
{
	// Arrange
	const LINE_WIDTH = 2;

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { lineWidth: LINE_WIDTH, valueProperty: "bogus" } });

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg path");

	// Assert
	t.true(pathElements.values().every(path => parseInt(path.getAttribute("stroke-width")) === LINE_WIDTH));
});

test("Force graph edge source/target properties function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-source-target-properties-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-source-target-properties.svg";
	const data = { nodes: Array.from(t.context.phylogeneticTree.nodes), edges: Array.from(t.context.phylogeneticTree.edges, edge =>
	{
		const newEdge = { ...edge, start: edge.source, end: edge.target };
		delete newEdge.source;
		delete newEdge.target;
		return newEdge;
	})};
	
	// Act
	const svg = await ForceGraph.draw(data, { edges: { labelProperty: "relationship", sourceProperty: "start", targetProperty: "end" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph edge valueProperty property functions as expected", async t =>
{
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship", valueProperty: "count" } });
	const LINE_WIDTH = 1;

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg path");

	// Assert
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(parseInt(pathElements[pathIndex].getAttribute("stroke-width")), (t.context.phylogeneticTree.edges[pathIndex].count || 0) + LINE_WIDTH);
});

test("Force graph node labels property with small nodes puts text labels outside the node", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/node-text-labels-outside-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/node-text-labels-outside.svg";
	const graphSettings =
	{
		edges:
		{
			labels: "none",
			labelProperty: "relationship"
		},
		nodes:
		{
			labels: "text",
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const textElements = svgDom.window.document.querySelectorAll("svg > text").length;
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(textElements.length, expectedTextElements.length);
});

test("Force graph node labels property with large nodes puts text labels inside the node", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/node-text-labels-inside-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/node-text-labels-inside.svg";
	const graphSettings =
	{
		edges:
		{
			labels: "none",
			labelProperty: "relationship"
		},
		nodes:
		{
			labels: "text",
			labelProperty: "name",
			radius: 50
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const textElements = svgDom.window.document.querySelectorAll("svg > text").length;
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(textElements.length, expectedTextElements.length);
});

test("Force graph node idProperty functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/node-id-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/node-id-property.svg";
	const data = { nodes: Array.from(t.context.phylogeneticTree.nodes, node =>
	{
		const newNode = { ...node, nodeId: node.id };
		delete newNode.id;
		return newNode;
	}), edges: Array.from(t.context.phylogeneticTree.edges)};
	
	// Act
	const svg = await ForceGraph.draw(data, { edges: { labelProperty: "relationship" }, nodes: { idProperty: "nodeId" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph node property = tooltips functions as expected", async t =>
{
	// Arrange
	const graphSettings =
	{
		nodes:
		{
			labels: "tooltip",
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);

	const svgDom = new JSDOM(svg);
	const circleElements = svgDom.window.document.querySelectorAll("svg circle");
	const titleElements = svgDom.window.document.querySelectorAll("svg circle + title");

	// Assert
	t.is(circleElements.length, titleElements.length);

	for (let titleIndex = 0; titleIndex < titleElements.length; titleIndex++)
		t.is(titleElements[titleIndex].textContent, t.context.phylogeneticTree.nodes[titleIndex].name);
});

test("Force graph node radius property functions as expected", async t =>
{
	// Arrange
	const RADIUS = 20;

	// Act
	const svg = await ForceGraph.draw(t.context.disjointedGraph, { nodes: { radius: RADIUS } });

	const svgDom = new JSDOM(svg);
	const circleElements = svgDom.window.document.querySelectorAll("svg circle");

	// Assert
	for (const circleElement of circleElements)
		t.is(parseInt(circleElement.getAttribute("r")), RADIUS);
});

test("Force graph node valueProperty property functions as expected", async t =>
{
	// Act
	const RADIUS = 5;
	const svg = await ForceGraph.draw(t.context.disjointedGraph, { nodes: { labelProperty: "id", valueProperty: "radius" }, useCenteringForce: false, usePositionalForce: true });

	const svgDom = new JSDOM(svg);
	const circleElements = svgDom.window.document.querySelectorAll("svg circle");

	// Assert
	for (let circleIndex = 0; circleIndex < circleElements.length; circleIndex++)
		t.is(parseInt(circleElements[circleIndex].getAttribute("r")), (t.context.disjointedGraph.nodes[circleIndex].radius || 0) + RADIUS);
});

test("Force graph node/edge groupProperty property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/group-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/group-property.svg";
	const data =
	{
		// nodes: t.context.phylogeneticTree.nodes,
		nodes: Array.from(t.context.phylogeneticTree.nodes, node =>
		{
			const newNode = { ...node, groupBy: node.group };
			delete newNode.group;
			return newNode;
		}),
		edges: t.context.phylogeneticTree.edges
		// edges: Array.from(t.context.phylogeneticTree.edges, edge =>
		// {
		// 	const newEdge = { ...edge, groupBy: edge.group };
		// 	delete newEdge.group;
		// 	return newEdge;
		// })
	};
	
	// Act
	// const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" } });
	// const svg = await ForceGraph.draw(data, { edges: { groupProperty: "groupBy", labelProperty: "relationship" }, nodes: { groupProperty: "groupBy" } });
	const svg = await ForceGraph.draw(data, { edges: { labelProperty: "relationship" }, nodes: { groupProperty: "groupBy" } });
	// const svg = await ForceGraph.draw(data, { edges: { groupProperty: "groupBy", labelProperty: "relationship" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;
	const titleElements = svgDom.window.document.querySelectorAll("svg title").length;
	const expectedTitleElements = EXPECTED_DOM.window.document.querySelectorAll("svg title").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
	t.is(titleElements.length, expectedTitleElements.length);
});

test("Force graph node/edge labels properties = text functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/edge-and-node-text-labels-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/edge-and-node-text-labels.svg";
	const graphSettings =
	{
		edges:
		{
			labels: "text",
			labelProperty: "relationship"
		},
		nodes:
		{
			labels: "text",
			labelProperty: "name"
		}
	};

	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, graphSettings);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph label fill colors", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/label-fill-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/label-fill-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" }, labels: { "fill": "#00AA00" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph label font family", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/label-font-family-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/label-font-family-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" }, labels: { "fontFamily": "Courier New" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph label font size", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/label-font-size-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/label-font-size-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" }, labels: { "fontSize": 10 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph label stroke color", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/label-stroke-color-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/label-stroke-color-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" }, labels: { "strokeColor": "#00AA00" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph label stroke width", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/ForceGraph/label-stroke-width-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/ForceGraph/label-stroke-width-property.svg";
	
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { edges: { labelProperty: "relationship" }, labels: { "strokeWidth": 3 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g").length;
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g").length;
	const pathElements = svgDom.window.document.querySelectorAll("svg > path").length;
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path").length;
	const circleElements = svgDom.window.document.querySelectorAll("svg > circle").length;
	const expectedCircleElements = EXPECTED_DOM.window.document.querySelectorAll("svg > circle").length;

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(circleElements.length, expectedCircleElements.length);
});

test("Force graph legend functions as expected.", async t =>
{
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { legend: { "type": "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Force graph swatches function as expected.", async t =>
{
	// Act
	const svg = await ForceGraph.draw(t.context.phylogeneticTree, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});