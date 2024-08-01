import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import PieChart from "../source/shared/Visualizations/PieChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw a pie chart chart", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/PieChart/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/PieChart/defaults.svg";

	// Act
	const svg = PieChart.draw(t.context.data);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
});

test("Pie chart labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/PieChart/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/PieChart/label-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, text: letter.key };
		delete newLetter.key;
		return newLetter;
	});

	// Act
	const svg = PieChart.draw(data, { labelProperty: "text" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
});

test("Pie chart valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/PieChart/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/PieChart/value-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = PieChart.draw(data, { valueProperty: "count" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
});

test("Pie chart holeRadius property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/PieChart/hole-radius-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/PieChart/hole-radius-property.svg";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = PieChart.draw(data, { holeRadius: 0.67, valueProperty: "count" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	
	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
});

test("Pie chart strokeColor property functions as expected.", async t =>
{
	// Arrange
	const STROKE_COLOR = "#ddd";
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = PieChart.draw(data, { strokeColor: STROKE_COLOR, valueProperty: "count" });

	const svgDom = new JSDOM(svg);
	const groupElement = svgDom.window.document.querySelector("svg > g");
	
	// Assert
	t.is(groupElement.getAttribute("stroke"), STROKE_COLOR);
});

test("Pie chart strokeWidth property functions as expected.", async t =>
{
	// Arrange
	const STROKE_WIDTH = 3;
	const data = Array.from(t.context.data, letter =>
	{
		const newLetter = { ...letter, count: letter.value };
		delete newLetter.value;
		return newLetter;
	});

	// Act
	const svg = PieChart.draw(data, { strokeWidth: STROKE_WIDTH, valueProperty: "count" });

	const svgDom = new JSDOM(svg);
	const groupElement = svgDom.window.document.querySelector("svg > g");
	
	// Assert
	t.is(parseInt(groupElement.getAttribute("stroke-width")), STROKE_WIDTH);
});

test("Pie chart legend functions as expected.", async t =>
{
	// Act
	const svg = PieChart.draw(t.context.data, { legend: { "type": "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Pie chart swatches function as expected.", async t =>
{
	// Act
	const svg = PieChart.draw(t.context.data, { legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});