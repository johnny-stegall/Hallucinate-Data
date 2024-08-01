import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import PieChart from "../source/shared/Visualizations/PieChart.js";
import HorizontalBarChart from "../source/shared/Visualizations/Bar/HorizontalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Arrayed (sequential) color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/arrayed-sequential-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/arrayed-sequential.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "schemePuBu" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Arrayed (divergent) color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/arrayed-divergent-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/arrayed-divergent.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "schemeSpectral" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Arrayed (with index) color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/arrayed-with-index-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/arrayed-with-index.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "schemeBlues[9]" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Categorical color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/categorical-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/categorical.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "schemeDark2" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Interpolated (divergent) color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/interpolated-divergent-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/interpolated-divergent.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "interpolateBrBG" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Interpolated (sequential) color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/interpolated-sequential-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/interpolated-sequential.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: "interpolateGreens" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Single color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/single-color-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/single-color.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: "#00AA00" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});

test("Specified color palettes function as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/color-palettes/specified-Expected.svg");
	const OUTPUT_FILE = "tests/results/color-palettes/specified.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { colorPalette: ["#AA0000", "#AAAA00", "#AA00AA", "#00AA00", "#00AAAA", "#0000AA"] });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	
	for (let pathIndex = 0; pathIndex < pathElements.length; pathIndex++)
		t.is(pathElements[pathIndex].getAttribute("fill"), expectedPathElements[pathIndex].getAttribute("fill"));
});