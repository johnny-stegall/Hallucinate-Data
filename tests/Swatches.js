import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import PieChart from "../source/shared/Visualizations/PieChart.js";
import HorizontalBarChart from "../source/shared/Visualizations/Bar/HorizontalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw swatches", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/swatches/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/swatches/defaults.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");
	const expectedSwatches = EXPECTED_DOM.window.document.querySelectorAll("span.swatches");

	// Assert
	for (let swatchIndex = 0; swatchIndex < swatches.length; swatchIndex++)
		t.is(swatches[swatchIndex].getAttribute("fill"), expectedSwatches[swatchIndex].getAttribute("fill"));
});

test("Swatches columnWidth property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/swatches/column-width-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/swatches/column-width-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches", columnWidth: 200 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const swatchesContainer = svgDom.window.document.querySelector("svg > foreignObject > div > div");
	const expectedContainerSwatches = EXPECTED_DOM.window.document.querySelector("svg > foreignObject > div > div");
	const swatches = svgDom.window.document.querySelectorAll("div.swatches-item");
	const expectedSwatches = EXPECTED_DOM.window.document.querySelectorAll("div.swatches-item");

	// Assert
	t.is(swatchesContainer.getAttribute("style"), expectedContainerSwatches.getAttribute("style"));

	for (let swatchIndex = 0; swatchIndex < swatches.length; swatchIndex++)
		t.is(swatches[swatchIndex].getAttribute("fill"), expectedSwatches[swatchIndex].getAttribute("fill"));
});

test("Swatches format property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/swatches/format-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/swatches/format-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches", format: d => d.toLowerCase() } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const swatchLabels = svgDom.window.document.querySelectorAll("span");
	const expectedSwatchLabels = EXPECTED_DOM.window.document.querySelectorAll("span");

	// Assert
	for (let swatchIndex = 0; swatchIndex < swatchLabels.length; swatchIndex++)
		t.is(swatchLabels[swatchIndex].textContent, expectedSwatchLabels[swatchIndex].textContent.toLowerCase());		
});

test("Swatches marginLeft property functions as expected", async t =>
{
	// Arrange
	const MARGIN_LEFT = 50;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches", marginLeft: MARGIN_LEFT } });

	const svgDom = new JSDOM(svg);
	const swatchesContainer = svgDom.window.document.querySelector("svg > foreignObject > div");

	// Assert
	t.is(swatchesContainer.style.marginLeft, `${MARGIN_LEFT}px`);
});

test("Swatches swatchHeight property functions as expected", async t =>
{
	// Arrange
	const SWATCH_HEIGHT = 25;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches", swatchHeight: SWATCH_HEIGHT } });

	const svgDom = new JSDOM(svg);
	const styleElement = svgDom.window.document.querySelector("style");
	const regEx = new RegExp(`\.swatches::before\{.*?height: ${SWATCH_HEIGHT}px.*?\}`);

	// Assert
	t.true(regEx.test(styleElement.textContent));
});

test("Swatches swatchWidth property functions as expected", async t =>
{
	// Arrange
	const SWATCH_WIDTH = 25;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Swatches", swatchWidth: SWATCH_WIDTH } });

	const svgDom = new JSDOM(svg);
	const styleElement = svgDom.window.document.querySelector("style");
	const regEx = new RegExp(`\.swatches::before\{.*?width: ${SWATCH_WIDTH}px.*?\}`);

	// Assert
	t.true(regEx.test(styleElement.textContent));
});

test("Swatches works with custom color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/swatches/custom-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/swatches/custom-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: ["#AA0000", "#AAAA00", "#AA00AA", "#00AA00", "#00AAAA", "#0000AA"], legend: { type: "Swatches" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");
	const expectedSwatches = EXPECTED_DOM.window.document.querySelectorAll("span.swatches");

	// Assert
	for (let swatchIndex = 0; swatchIndex < swatches.length; swatchIndex++)
		t.is(swatches[swatchIndex].getAttribute("fill"), expectedSwatches[swatchIndex].getAttribute("fill"));
});
	
test("Swatches works with a single custom color", async t =>
{
	// Arrange
	const COLOR_PALETTE = "#00AA00";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: COLOR_PALETTE, legend: { type: "Swatches" } });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	for (const swatch of swatches)
		t.true(swatch.getAttribute("style").indexOf(COLOR_PALETTE) > -1);
});

test("Swatches takes viewbox into account when positioning", async t =>
{
	// Act
	const svg = PieChart.draw(t.context.data, { legend: { "type": "Swatches" }, viewBox: "-500, -500, 1000, 1000" });

	const svgDom = new JSDOM(svg);
	const swatchesElement = svgDom.window.document.querySelector("svg > foreignObject > div");

	// Assert
	t.true(swatchesElement.getAttribute("style").indexOf("left: -480") > -1);
	t.true(swatchesElement.getAttribute("style").indexOf("top: -480") > -1);
});

test("Swatches takes visualization margins into account when positioning", async t =>
{
	// Arrange
	const MARGIN_LEFT = 7;
	const MARGIN_TOP = 13;

	// Act
	const svg = PieChart.draw(t.context.data, { legend: { "type": "Swatches" }, marginLeft: MARGIN_LEFT, marginTop: MARGIN_TOP });

	const svgDom = new JSDOM(svg);
	const swatchesElement = svgDom.window.document.querySelector("svg > foreignObject > div");

	// Assert
	t.true(swatchesElement.getAttribute("style").indexOf(`left: ${MARGIN_LEFT}`) > -1);
	t.true(swatchesElement.getAttribute("style").indexOf(`top: ${MARGIN_TOP}`) > -1);
});