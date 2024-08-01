import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import Histogram from "../source/shared/Visualizations/Histogram.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/diamonds.json"));
});

test("Draw a histogram", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Histogram/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Histogram/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newDiamond = { ...data, key: data.carat, value: data.price };
		delete newDiamond.carat;
		delete newDiamond.price;
		return newDiamond;
	});

	// Act
	const svg = Histogram.draw(data);
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

test("Histogram bins property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Histogram/bins-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Histogram/bins-property.svg";

	// Act
	const svg = Histogram.draw(t.context.data, { bins: 40, labelProperty: "carat", valueProperty: "price" });
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

test("Histogram labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Histogram/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Histogram/label-property.svg";

	// Act
	const svg = Histogram.draw(t.context.data, { labelProperty: "carat", valueProperty: "price" });
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

test("Histogram valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Histogram/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Histogram/value-property.svg";

	// Act
	const svg = Histogram.draw(t.context.data, { labelProperty: "carat", valueProperty: "price" });
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

test("Histogram legend functions as expected.", async t =>
{
	// Act
	const svg = Histogram.draw(t.context.data, { legend: { "type": "Legend" }, labelProperty: "carat", valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Histogram swatches function as expected.", async t =>
{
	// Act
	const svg = Histogram.draw(t.context.data, { legend: { type: "Swatches" }, labelProperty: "carat", valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Histogram x-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 9;
	const EDGE_TICKS = 2;

	// Act
	const svg = Histogram.draw(t.context.data, { axes: { x: { ticks: TICKS } }, labelProperty: "carat", valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${Histogram.defaults.height - Histogram.defaults.marginBottom})']`);
	const ticks = xAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(xAxisGroup != null);
	t.is(ticks.length, TICKS + EDGE_TICKS);
});

test("Histogram y-axis functions as expected.", async t =>
{
	// Arrange
	const TICKS = 3;

	// Act
	const svg = Histogram.draw(t.context.data, { axes: { y: { tickFormat: "%", ticks: TICKS } }, labelProperty: "carat", valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${Histogram.defaults.marginLeft},0)']`);
	const ticks = yAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(yAxisGroup != null);
	t.is(ticks.length, TICKS);
});
