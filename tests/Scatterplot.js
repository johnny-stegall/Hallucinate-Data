import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import Scatterplot from "../source/shared/Visualizations/Scatterplot.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/cars.json"));
});

test("Draw a scatterplot", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Scatterplot/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Scatterplot/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newRecord = { ...data, key: data.name, valueX: data.mpg, valueY: data.hp };
		delete newRecord.name;
		delete newRecord.mpg;
		delete newRecord.hp;
		return newRecord;
	});

	// Act
	const svg = Scatterplot.draw(data, { colorPalette: "schemeCategory10" });
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

test("Scatterplot labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Scatterplot/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Scatterplot/label-property.svg";

	// Act
	const svg = Scatterplot.draw(t.context.data, { colorPalette: "schemeCategory10", labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });
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

test("Scatterplot valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Scatterplot/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Scatterplot/value-property.svg";

	// Act
	const svg = Scatterplot.draw(t.context.data, { colorPalette: "schemeCategory10", labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });
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

test("Scatterplot legend functions as expected.", async t =>
{
	// Act
	const svg = Scatterplot.draw(t.context.data, { colorPalette: "schemeCategory10", legend: { "type": "Legend" }, labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Scatterplot swatches function as expected.", async t =>
{
	// Act
	const svg = Scatterplot.draw(t.context.data, { colorPalette: "schemeCategory10", legend: { type: "Swatches" }, labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});

test("Scatterplot x-axis functions as expected.", async t =>
{
	// Arrange
	const MARGIN_BOTTOM = 30;
	const VISUAL_HEIGHT = 1000;
	const TICKS = 17;

	// Act
	const svg = Scatterplot.draw(t.context.data, { axes: { x: { ticks: TICKS } }, colorPalette: "schemeCategory10", labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${VISUAL_HEIGHT - MARGIN_BOTTOM})']`);
	const ticks = xAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(xAxisGroup != null);
	t.is(ticks.length, TICKS);
});

test("Scatterplot y-axis functions as expected.", async t =>
{
	// Arrange
	const MARGIN_LEFT = 40;
	const TICKS = 17;

	// Act
	const svg = Scatterplot.draw(t.context.data, { axes: { y: { ticks: TICKS } }, colorPalette: "schemeCategory10", labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${MARGIN_LEFT},0)']`);
	const ticks = yAxisGroup.querySelectorAll("g.tick");

	// Assert
	t.true(yAxisGroup != null);
	t.is(ticks.length, TICKS);
});

test("Scatterplot grid functions as expected.", async t =>
{
	// Arrange
	const TICKS = 7;

	// Act
	const svg = Scatterplot.draw(t.context.data, { axes: { x: { ticks: TICKS }, y: { ticks: TICKS } }, colorPalette: "schemeCategory10", labelProperty: "name", valuePropertyX: "mpg", valuePropertyY: "hp" });

	const svgDom = new JSDOM(svg);
	const gridGroups = svgDom.window.document.querySelectorAll("svg g[stroke='currentColor'] > g");

	// Assert
	for (const gridGroup of gridGroups)
	{
		const lines = gridGroup.querySelectorAll("line");
		t.is(lines.length, TICKS);
	}
});