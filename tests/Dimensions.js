import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import PieChart from "../source/shared/Visualizations/PieChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Defaults are honored.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/defaults.svg";

	// Act
	const svg = PieChart.draw(t.context.data);
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
});

test("The fontFamily property changes the visualization font family.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/font-family-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/font-family.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { fontFamily: "Courier" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(gElements[1].getAttribute("font-family"), expectedGElements[1].getAttribute("font-family"));
});

test("The fontSize property changes the visualization font size.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/font-size-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/font-size.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { fontSize: 10 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(gElements[1].getAttribute("font-size"), expectedGElements[1].getAttribute("font-size"));
});

test("The height property changes the visualization height.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/height-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/height.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { height: 500 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("height"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("height"));
});

test("The marginBottom property changes The bottom margin.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/margin-bottom-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/margin-bottom.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { marginBottom: 50 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("margin-bottom"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("margin-bottom"));
});

test("The marginLeft property changes The left margin.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/margin-left-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/margin-left.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { marginLeft: 50 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("margin-left"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("margin-left"));
});

test("The marginRight property changes The right margin.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/margin-right-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/margin-right.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { marginRight: 50 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("margin-right"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("margin-right"));
});

test("The marginTop property changes The top margin.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/margin-top-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/margin-top.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { marginTop: 50 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
});

test("The width property changes the visualization width.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/width-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/width.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { width: 500 });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("width"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("width"));
});

test("The viewBox property changes the visualization view box.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/dimensions/viewbox-Expected.svg");
	const OUTPUT_FILE = "tests/results/dimensions/viewbox.svg";

	// Act
	const svg = PieChart.draw(t.context.data, { viewBox: "-1013, -1013, 1013, 1013" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const gElements = svgDom.window.document.querySelectorAll("svg > g");
	const expectedGElements = EXPECTED_DOM.window.document.querySelectorAll("svg > g");
	const pathElements = svgDom.window.document.querySelectorAll("svg > path");
	const expectedPathElements = EXPECTED_DOM.window.document.querySelectorAll("svg > path");
	const textElements = svgDom.window.document.querySelectorAll("svg > text");
	const expectedTextElements = EXPECTED_DOM.window.document.querySelectorAll("svg > text");

	// Assert
	t.is(gElements.length, expectedGElements.length);
	t.is(pathElements.length, expectedPathElements.length);
	t.is(textElements.length, expectedTextElements.length);
	t.is(svgDom.window.document.querySelector("svg").getAttribute("viewbox"), EXPECTED_DOM.window.document.querySelector("svg").getAttribute("viewbox"));
});