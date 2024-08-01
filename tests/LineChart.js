import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import LineChart from "../source/shared/Visualizations/LineChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/unemployment.json"));
});

test("Draw a line chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/LineChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/LineChart/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newRecord = { ...data, group: data.division, key: data.date, value: data.unemployment };
		delete newRecord.date;
		delete newRecord.division;
		delete newRecord.unemployment;
		return newRecord;
	});

	// Act
	const svg = LineChart.draw(data, { colorPalette: "schemeDark2" });
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

test("Line chart groupProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/LineChart/group-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/LineChart/group-property.svg";

	// Act
	const svg = LineChart.draw(t.context.data, { colorPalette: "schemeDark2", groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });
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
	
test("Line chart labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/LineChart/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/LineChart/label-property.svg";

	// Act
	const svg = LineChart.draw(t.context.data, { colorPalette: "schemeDark2", groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });
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

test("Line chart valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/LineChart/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/LineChart/value-property.svg";

	// Act
	const svg = LineChart.draw(t.context.data, { colorPalette: "schemeDark2", groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });
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

test("Line chart legend functions as expected.", async t =>
{
	// Act
	const svg = LineChart.draw(t.context.data, { colorPalette: "schemeDark2", legend: { "type": "Legend" }, groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Line chart swatches function as expected.", async t =>
{
	// Act
	const svg = LineChart.draw(t.context.data, { colorPalette: "schemeDark2", legend: { type: "Swatches" }, groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Line chart x-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 5;
	const EDGE_TICKS = 2;

	// Act
	const svg = LineChart.draw(t.context.data, { axes: { x: { ticks: TICKS } }, colorPalette: "schemeDark2", groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${LineChart.defaults.height - LineChart.defaults.marginBottom})']`);
	const ticks = xAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(xAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});

test("Line chart y-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 4;

	// Act
	const svg = LineChart.draw(t.context.data, { axes: { y: { ticks: TICKS } }, colorPalette: "schemeDark2", groupProperty: "division", labelProperty: "date", valueProperty: "unemployment" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${LineChart.defaults.marginLeft},0)']`);
	const ticks = yAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(yAxisGroup != null);
	t.is(ticks.length, TICKS);
});
