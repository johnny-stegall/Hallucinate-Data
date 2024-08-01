import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import BoxPlot from "../source/shared/Visualizations/BoxPlot.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/diamonds.json"));
});

test("Draw a box plot", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/BoxPlot/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/BoxPlot/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newDiamond = { ...data, key: data.carat, value: data.price };
		delete newDiamond.carat;
		delete newDiamond.price;
		return newDiamond;
	});

	// Act
	const svg = BoxPlot.draw(data);
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

test("Box plot bins property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/BoxPlot/bins-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/BoxPlot/bins-property.svg";

	// Act
	const svg = BoxPlot.draw(t.context.data, { bins: 20, labelProperty: "carat", valueProperty: "price" });
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

test("Box plot labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/BoxPlot/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/BoxPlot/label-property.svg";

	// Act
	const svg = BoxPlot.draw(t.context.data, { labelProperty: "carat", valueProperty: "price" });
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

test("Box plot valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/BoxPlot/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/BoxPlot/value-property.svg";

	// Act
	const svg = BoxPlot.draw(t.context.data, { labelProperty: "carat", valueProperty: "price" });
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

test("Box plot legend functions as expected.", async t =>
{
	// Act
	const svg = BoxPlot.draw(t.context.data, { bins: 20, labelProperty: "carat", legend: { "type": "Legend" }, valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Box plot swatches functions as expected.", async t =>
{
	// Act
	const svg = BoxPlot.draw(t.context.data, { bins: 20, labelProperty: "carat", legend: { "type": "Swatches" }, valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Box plot x-axis functions as expected.", async t =>
{
	// Arrange
	const BINS = 20;
	const MARGIN_BOTTOM = 30;
	const TICKS = 10;
	const VISUAL_HEIGHT = 1000;

	// Act
	const svg = BoxPlot.draw(t.context.data, { axes: { x: { tickFormat: "%", ticks: TICKS }, bins: BINS, labelProperty: "carat", valueProperty: "price" } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${VISUAL_HEIGHT - MARGIN_BOTTOM})']`);

	// Assert
	t.true(xAxisGroup != null);
});

test("Box plot y-axis functions as expected.", async t =>
{
	// Arrange
	const BINS = 20;
	const MARGIN_LEFT = 40;
	const TICKS = 10;

	// Act
	const svg = BoxPlot.draw(t.context.data, { axes: { y: { ticks: TICKS } }, bins: BINS, labelProperty: "carat", valueProperty: "price" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${MARGIN_LEFT},0)']`);

	// Assert
	t.true(yAxisGroup != null);
});