import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import CirclePack from "../source/shared/Visualizations/Hierarchical/CirclePack.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/flare.json"));
});

test("Draw a circle pack", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/CirclePack/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/CirclePack/defaults.svg";

	// Act
	const svg = CirclePack.draw(t.context.data);
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

test("Circle pack childrenProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/CirclePack/children-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/CirclePack/children-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"children\"", "\"descendants\""));

	// Act
	const svg = CirclePack.draw(data, { childrenProperty: "descendants" });
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

test("Circle pack labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/CirclePack/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/CirclePack/label-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"key\"", "\"name\""));

	// Act
	const svg = CirclePack.draw(data, { labelProperty: "name" });
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

test("Circle pack valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/CirclePack/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/CirclePack/value-property.svg";
	const data = JSON.parse(JSON.stringify(t.context.data).replaceAll("\"value\"", "\"count\""));

	// Act
	const svg = CirclePack.draw(data, { valueProperty: "count" });
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

test("Circle pack legend functions as expected.", async t =>
{
	// Arrange
	const LEFT = 480;
	const TOP = 525;

	// Act
	const svg = CirclePack.draw(t.context.data, { legend: { "type": "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const circlesGroup = svgDom.window.document.querySelector("svg > svg + g");
	const rootCircle = circlesGroup.querySelector(`g[transform="translate(${LEFT},${TOP})"]`);

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
	t.true(circlesGroup != null);
	t.true(rootCircle != null);
});

test("Circle pack swatches function as expected.", async t =>
{
	// Act
	const svg = CirclePack.draw(t.context.data, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});