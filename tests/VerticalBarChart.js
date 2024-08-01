import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import VerticalBarChart from "../source/shared/Visualizations/Bar/VerticalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw a vertical bar chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/VerticalBarChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/VerticalBarChart/defaults.svg";

	// Act
	const svg = VerticalBarChart.draw(t.context.data);
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

test("Vertical bar chart barWidth property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/VerticalBarChart/bar-width-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/VerticalBarChart/bar-width-property.svg";

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { barWidth: 3 });
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

test("Vertical bar chart labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/VerticalBarChart/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/VerticalBarChart/label-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, text: letter.key };
		delete newLetter.key;
		return newLetter;
	});

	// Act
	const svg = VerticalBarChart.draw(data, { labelProperty: "text" });
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

test("Vertical bar chart valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/VerticalBarChart/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/VerticalBarChart/value-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = VerticalBarChart.draw(data, { valueProperty: "count" });
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

test("Vertical bar chart legend functions as expected.", async t =>
{
	// Act
	const svg = VerticalBarChart.draw(t.context.data, { legend: { "type": "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Vertical bar chart swatches function as expected.", async t =>
{
	// Act
	const svg = VerticalBarChart.draw(t.context.data, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Vertical bar chart x-axis functions as expected.", async t =>
{
	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { x: { ticks: 26 } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${VerticalBarChart.defaults.height - VerticalBarChart.defaults.marginBottom})']`);

	// Assert
	t.true(xAxisGroup != null);
});

test("Vertical bar chart y-axis functions as expected.", async t =>
{
	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { tickFormat: "%", ticks: 10 } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);

	// Assert
	t.true(yAxisGroup != null);
});