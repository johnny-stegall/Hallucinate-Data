import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import Treemap from "../source/shared/Visualizations/Hierarchical/Treemap.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/flare-stratified.json"));
});

test("Draw a treemap", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Treemap/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Treemap/defaults.svg";
	const data = JSON.parse(JSON.stringify(t.context.data)
		.replaceAll("\"name\"", "\"path\"")
		.replaceAll("\"size\"", "\"value\"")
	);

	// Act
	const svg = Treemap.draw(data);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Treemap pathProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Treemap/path-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Treemap/path-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"size\"", "\"value\""));

	// Act
	const svg = Treemap.draw(data, { pathProperty: "name" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Treemap valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Treemap/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Treemap/value-property.svg";

	// Act
	const svg = Treemap.draw(t.context.data, { pathProperty: "name", valueProperty: "size" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const rectElements = svgDom.window.document.querySelectorAll("svg > rect");
	const expectedRectElements = EXPECTED_DOM.window.document.querySelectorAll("svg > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(rectElements.length, expectedRectElements.length);
});

test("Treemap legend functions as expected.", async t =>
{
	// Act
	const svg = Treemap.draw(t.context.data, { legend: { "type": "Legend", width: 1000 }, pathProperty: "name", valueProperty: "size" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Treemap swatches function as expected.", async t =>
{
	// Act
	const svg = Treemap.draw(t.context.data, { legend: { "type": "Swatches" }, pathProperty: "name", valueProperty: "size" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});