import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import StackedHorizontalBarChart from "../source/shared/Visualizations/Bar/Grouped/StackedHorizontalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/state-demographics-stacks.json"));
	t.context.stackedData = JSON.parse(await Fs.readFile("tests/data/state-demographics-stacks.json"));
});

test("Draw a stacked horizontal bar chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/StackedHorizontalBarChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/StackedHorizontalBarChart/defaults.svg";
	const data = Array.from(t.context.stackedData, data =>
	{
		const newState = { ...data, group: data.state, key: data.age, value: data.population };
		delete newState.state;
		delete newState.age;
		delete newState.population;
		return newState;
	});

	// Act
	const svg = StackedHorizontalBarChart.draw(data);
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

test("Stacked horizontal bar chart seriesGroupProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/StackedHorizontalBarChart/series-group-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/StackedHorizontalBarChart/series-group-property.svg";

	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.stackedData, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
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

test("Stacked horizontal bar chart seriesLabelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/StackedHorizontalBarChart/series-label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/StackedHorizontalBarChart/series-label-property.svg";

	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.stackedData, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
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

test("Stacked horizontal bar chart seriesValueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/StackedHorizontalBarChart/series-value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/StackedHorizontalBarChart/series-value-property.svg";

	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.stackedData, { seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });
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

test("Stacked horizontal bar chart legend functions as expected.", async t =>
{
	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.stackedData, { legend: { "type": "Legend" }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Stacked horizontal bar chart swatches function as expected.", async t =>
{
	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.stackedData, { legend: { "type": "Swatches" }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Stacked horizontal bar chart x-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 6;
	const EDGE_TICKS = 2;

	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.data, { axes: { x: { ticks: TICKS } }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${StackedHorizontalBarChart.defaults.height - StackedHorizontalBarChart.defaults.marginBottom})']`);
	const ticks = xAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(xAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});

test("Stacked horizontal bar chart y-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 50;
	const EDGE_TICKS = 2;

	// Act
	const svg = StackedHorizontalBarChart.draw(t.context.data, { axes: { y: { ticks: TICKS } }, seriesGroupProperty: "state", seriesLabelProperty: "age", seriesValueProperty: "population" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${StackedHorizontalBarChart.defaults.marginLeft},0)']`);
	const ticks = yAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(yAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});
