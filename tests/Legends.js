import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import PieChart from "../source/shared/Visualizations/PieChart.js";
import HorizontalBarChart from "../source/shared/Visualizations/Bar/HorizontalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw a legend", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/defaults.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend height property functions as expected", async t =>
{
	// Arrange
	const HEIGHT = 500;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", height: HEIGHT } });
	const svgDom = new JSDOM(svg);
	const legendSvg = svgDom.window.document.querySelector("svg > svg");

	// Assert
	t.is(parseInt(legendSvg.getAttribute("height")), HEIGHT);
});

test("Legend marginBottom property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/margin-bottom-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/margin-bottom-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", marginBottom: 21 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend marginLeft property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/margin-left-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/margin-left-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", marginLeft: 21 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend marginRight property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/margin-right-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/margin-right-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", marginRight: 21 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend marginTop property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/margin-top-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/margin-top-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", marginTop: 21 } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend tickFormat property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/tick-format-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/tick-format-property.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", tickFormat: d => d.toLowerCase() } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");
	const tickElements = legendSvgElement.querySelectorAll("g.tick > text");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
	{
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
		t.is(tickElements[rectIndex].textContent, tickElements[rectIndex].textContent.toLowerCase());
	}
});

test("Legend tickSize property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/tick-size-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/tick-size-property.svg";
	const TICK_SIZE = 10;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", tickSize: TICK_SIZE } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");
	const tickElements = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));

	for (const tickElement of tickElements)
	{
		t.is(parseInt(tickElement.getAttribute("height")), TICK_SIZE);
		t.is(parseInt(tickElement.getAttribute("width")), 35);
	}
});

test("Legend tickValues property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/tick-values-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/tick-values-property.svg";
	const TICK_VALUES = [...Array(11).keys()].slice(1);

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", tickValues: TICK_VALUES } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");
	const tickElements = legendSvgElement.querySelectorAll("g.tick > text");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));

	for (let tickIndex = 0; tickIndex < tickElements.length; tickIndex++)
			t.is(parseInt(tickElements[tickIndex].textContent), TICK_VALUES[tickIndex]);
});

test("Legend title property functions as expected", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/title-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/title-property.svg";
	const TITLE = "The Legend of Zelda";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", title: TITLE } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");
	const titleElement = legendSvgElement.querySelector("text.title");

	// Assert
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));
	t.is(titleElement.textContent, TITLE);

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend width property functions as expected", async t =>
{
	// Arrange
	const WIDTH = 500;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { legend: { type: "Legend", width: WIDTH } });

	const svgDom = new JSDOM(svg);
	const legendSvg = svgDom.window.document.querySelector("svg > svg");

	// Assert
	t.is(parseInt(legendSvg.getAttribute("width")), WIDTH);
});

test("Legend takes viewbox into account when positioning", async t =>
{
	// Act
	const svg = PieChart.draw(t.context.data, { legend: { "type": "Legend" }, viewBox: "-500, -500, 1000, 1000" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");

	// Assert
	t.is(parseInt(legendSvgElement.getAttribute("x")), -480);
	t.is(parseInt(legendSvgElement.getAttribute("y")), -480);
});

test("Legend takes visualization margins into account when positioning", async t =>
{
	// Arrange
	const MARGIN_LEFT = 13;
	const MARGIN_TOP = 7;

	// Act
	const svg = PieChart.draw(t.context.data, { legend: { "type": "Legend" }, marginLeft: MARGIN_LEFT, marginTop: MARGIN_TOP });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");

	// Assert
	t.is(parseInt(legendSvgElement.getAttribute("x")), MARGIN_LEFT);
	t.is(parseInt(legendSvgElement.getAttribute("y")), MARGIN_TOP);
});

test("Legend works with categorical color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/categorical-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/categorical-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: "schemeCategory10", legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend works with interpolated color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/interpolated-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/interpolated-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: "interpolateViridis", legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend works with sequential color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/sequential-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/sequential-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: "interpolateGreens", legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend works with array color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/array-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/array-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: "schemeBlues[7]", legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend works with custom color palettes", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Legends/custom-colors-Expected.svg");
	const OUTPUT_FILE = "tests/results/Legends/custom-colors.svg";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: ["#AA0000", "#AAAA00", "#AA00AA", "#00AA00", "#00AAAA", "#0000AA"], legend: { type: "Legend" } });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const expectedLegendSvgElement = EXPECTED_DOM.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");
	const expectedColorRamp = expectedLegendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(legendSvgElement.getAttribute("height"), expectedLegendSvgElement.getAttribute("height"));
	t.is(legendSvgElement.getAttribute("width"), expectedLegendSvgElement.getAttribute("width"));

	for (let rectIndex = 0; rectIndex < colorRamp.length; rectIndex++)
		t.is(colorRamp[rectIndex].getAttribute("fill"), expectedColorRamp[rectIndex].getAttribute("fill"));
});

test("Legend works with a single custom color", async t =>
{
	// Arrange
	const COLOR_PALETTE = "#00AA00";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { colorPalette: COLOR_PALETTE, legend: { type: "Legend" } });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	for (const color of colorRamp)
		t.is(color.getAttribute("fill"), COLOR_PALETTE);
});
