import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import GroupedBarChart from "../source/shared/Visualizations/Bar/Grouped/GroupedBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/state-demographics-stacks.json"));
	t.context.stackedData = JSON.parse(await Fs.readFile("tests/data/state-demographics-stacks.json"));
});

test("Draw a grouped bar chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/GroupedBarChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/GroupedBarChart/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newState = { ...data, group: data.state, key: data.age, value: data.population };
		delete newState.state;
		delete newState.age;
		delete newState.population;
		return newState;
	});

	// Act
	const svg = GroupedBarChart.draw(data);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Grouped bar chart seriesGroupProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/GroupedBarChart/series-group-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/GroupedBarChart/series-group-property.svg";

	// Act
	const svg = GroupedBarChart.draw(t.context.data, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Grouped bar chart seriesLabelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/GroupedBarChart/series-label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/GroupedBarChart/series-label-property.svg";

	// Act
	const svg = GroupedBarChart.draw(t.context.data, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Grouped bar chart seriesValueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/GroupedBarChart/series-value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/GroupedBarChart/series-value-property.svg";

	// Act
	const svg = GroupedBarChart.draw(t.context.data, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Grouped bar chart legend functions as expected.", async t =>
{
	// Act
	const svg = GroupedBarChart.draw(t.context.data, { legend: { "type": "Legend" }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Grouped bar chart swatches function as expected.", async t =>
{
	// Act
	const svg = GroupedBarChart.draw(t.context.data, { legend: { "type": "Swatches" }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Grouped bar chart x-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 7;
	const EDGE_TICKS = 2;

	// Act
	const svg = GroupedBarChart.draw(t.context.data, { axes: { x: { ticks: TICKS } }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${GroupedBarChart.defaults.height - GroupedBarChart.defaults.marginBottom})']`);
	const ticks = xAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(xAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});

test("Grouped bar chart y-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 11;
	const EDGE_TICKS = 2;

	// Act
	const svg = GroupedBarChart.draw(t.context.data, { axes: { y: { ticks: TICKS } }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${GroupedBarChart.defaults.marginLeft},0)']`);
	const ticks = yAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(yAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});