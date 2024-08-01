import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import WordCloud from "../source/shared/Visualizations/WordCloud.js";

// TODO: NodeJS 20 and later are throwing ERR_INTERNAL_ASSERTION running these tests
// but these tests run and pass if all other files are removed and only this file is run
test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/fortune-100.json"));
});

test.skip("Draw a word cloud", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/WordCloud/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/WordCloud/defaults.svg";
	const data = Array.from(t.context.data, data =>
	{
		const newCompany = { ...data, key: data.company };
		delete newCompany.company;
		return newCompany;
	});

	// Act
	const svg = await WordCloud.draw(data);
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

test.skip("Word cloud labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/WordCloud/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/WordCloud/label-property.svg";

	// Act
	const svg = await WordCloud.draw(t.context.data, { labelProperty: "company" });
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

test.skip("Word cloud valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/WordCloud/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/WordCloud/value-property.svg";
	const data = Array.from(t.context.data, company =>
	{
		const newCompany = { ...company, position: company.value };
		delete newCompany.value;
		return newCompany;
	});

	// Act
	const svg = await WordCloud.draw(data, { labelProperty: "company", valueProperty: "position" });
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

test.skip("Word cloud rotate property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/WordCloud/rotate-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/WordCloud/rotate-property.svg";

	// Act
	const svg = await WordCloud.draw(t.context.data, { labelProperty: "company", rotate: 30 });
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

test.skip("Word cloud wordPadding property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/WordCloud/word-padding-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/WordCloud/word-padding-property.svg";

	// Act
	const svg = await WordCloud.draw(t.context.data, { labelProperty: "company", wordPadding: 5 });
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