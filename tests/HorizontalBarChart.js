import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import HorizontalBarChart from "../source/shared/Visualizations/Bar/HorizontalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw a horizontal bar chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/HorizontalBarChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/HorizontalBarChart/defaults.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data);
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

test("Horizontal bar chart barHeight property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/HorizontalBarChart/bar-height-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/HorizontalBarChart/bar-height-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { barHeight: 3 });
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

test("Horizontal bar chart labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/HorizontalBarChart/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/HorizontalBarChart/label-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, text: letter.key };
		delete newLetter.key;
		return newLetter;
	});

	// Act
	const svg = HorizontalBarChart.draw(data, { labelProperty: "text" });
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

test("Horizontal bar chart valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/HorizontalBarChart/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/HorizontalBarChart/value-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = HorizontalBarChart.draw(data, { valueProperty: "count" });
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

test("Horizontal bar chart legend functions as expected.", async t =>
{
	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { "type": "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Horizontal bar chart swatches function as expected.", async t =>
{
	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Horizontal bar chart x-axis functions as expected.", async t =>
{
	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { tickFormat: "%", ticks: 10 } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);

	// Assert
	t.true(xAxisGroup != null);
});

test("Horizontal bar chart y-axis functions as expected.", async t =>
{
	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { y: { ticks: 26 } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${HorizontalBarChart.defaults.marginLeft},0)']`);

	// Assert
	t.true(yAxisGroup != null);
});