import test from "ava";
import IVisualization from "../source/shared/Visualizations/IVisualization.js";
import ForceGraph from "../source/shared/Visualizations/ForceGraph.js";
import Sunburst from "../source/shared/Visualizations/Hierarchical/Sunburst.js";
import VerticalBarChart from "../source/shared/Visualizations/Bar/VerticalBarChart.js";

test("IVisualization defaults property functions as expected.", async t =>
{
	// Arrange
	const DEFAULTS =
	{
		colorPalette: "schemeCategory10",
		fontFamily: "Arial, Helvitica, Sans-Serif",
		fontSize: 14,
		height: 1000,
		labelProperty: "key",
		marginBottom: 20,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		valueProperty: "value",
		width: 1000
	};

	// Act & Assert
	t.deepEqual(IVisualization.defaults, DEFAULTS);
	t.true(Object.isFrozen(IVisualization.defaults));
});

test("IVisualization schemaFile property functions as expected.", async t =>
{
	// Arrange
	const FORCE_GRAPH_FILE = "force-graph.json";
	const SUNBURST_SCHEMA_FILE = "hierarchical.json";
	const VERTICAL_BAR_CHART_SCHEMA_FILE = "bar-chart.json";

	// Act
	const forceGraphSchemaFile = ForceGraph.schemaFile;
	const sunburstSchemaFile = Sunburst.schemaFile;
	const verticalBarChartSchemaFile = VerticalBarChart.schemaFile;

	// Assert
	t.is(forceGraphSchemaFile, FORCE_GRAPH_FILE);
	t.is(sunburstSchemaFile, SUNBURST_SCHEMA_FILE);
	t.is(verticalBarChartSchemaFile, VERTICAL_BAR_CHART_SCHEMA_FILE);
});

test("IVisualization draw method throws a TypeError.", async t =>
{
	// Act & Assert
	const error = t.throws(() => IVisualization.draw(), { instanceOf: TypeError });
	t.is(error.message, "Not implemented.");
});

test("IVisualization applyDefaults method applies defaults as expected.", async t =>
{
	// Arrange
	const visual = { colorPalette: "schemeCategory20", fontFamily: "Arial", fontSize: 16, height: 500, width: 500 };
	const expected = { ...IVisualization.defaults, ...visual };

	// Act
	const actual = IVisualization.applyDefaults(visual);

	// Assert
	t.deepEqual(actual, expected);
});

test("IVisualization applyDefaults method applies axes defaults as expected.", async t =>
{
	// Arrange
	const visual = { axes: { x: { location: "Top" }, y: { location: "Right" } } };
	const expected = { ...IVisualization.defaults, axes: { x: { location: "Top" }, y: { location: "Right" } } };

	// Act
	const actual = IVisualization.applyDefaults(visual);

	// Assert
	t.deepEqual(actual, expected);
});

test("IVisualization applyDefaults method applies legend defaults as expected.", async t =>
{
	// Arrange
	const visual = { legend: { height: 100, marginTop: 10, marginRight: 10, marginBottom: 10, marginLeft: 10, ticks: 10, tickSize: 10, width: 100 } };
	const expected = { ...IVisualization.defaults, legend: { height: 100, marginTop: 10, marginRight: 10, marginBottom: 10, marginLeft: 10, ticks: 10, tickSize: 10, width: 100 } };

	// Act
	const actual = IVisualization.applyDefaults(visual);

	// Assert
	t.deepEqual(actual, expected);
});

test("IVisualization applyDefaults method applies swatches defaults as expected.", async t =>
{
	// Arrange
	const visual = { legend: { type: "Swatches", marginLeft: 10, swatchHeight: 10, swatchWidth: 10 } };
	const expected = { ...IVisualization.defaults, legend: { type: "Swatches", marginLeft: 10, swatchHeight: 10, swatchWidth: 10 } };

	// Act
	const actual = IVisualization.applyDefaults(visual);

	// Assert
	t.deepEqual(actual, expected);
});