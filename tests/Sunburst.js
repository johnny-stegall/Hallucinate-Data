import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import Sunburst from "../source/shared/Visualizations/Hierarchical/Sunburst.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/flare.json"));
});

test("Draw a sunburst", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Sunburst/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Sunburst/defaults.svg";

	// Act
	const svg = Sunburst.draw(t.context.data);
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

test("Sunburst childrenProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Sunburst/children-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Sunburst/children-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"children\"", "\"descendants\""));

	// Act
	const svg = Sunburst.draw(data, { childrenProperty: "descendants" });
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

test("Sunburst labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Sunburst/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Sunburst/label-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"key\"", "\"name\""));

	// Act
	const svg = Sunburst.draw(data, { labelProperty: "name" });
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

test("Sunburst valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Sunburst/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Sunburst/value-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"value\"", "\"count\""));

	// Act
	const svg = Sunburst.draw(data, { valueProperty: "count" });
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

test("Sunburst legend functions as expected.", async t =>
{
	// Arrange
	const LEFT = 500;
	const TOP = 550;

	// Act
	const svg = Sunburst.draw(t.context.data, { legend: { "type": "Legend", width: 1000 } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const groups = svgDom.window.document.querySelectorAll(`svg > g[transform="translate(${LEFT},${TOP})"]`);

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
	t.is(groups.length, 2);
});

test("Sunburst swatches function as expected.", async t =>
{
	// Act
	const svg = Sunburst.draw(t.context.data, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});