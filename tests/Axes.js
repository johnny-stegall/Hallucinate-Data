import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import HorizontalBarChart from "../source/shared/Visualizations/Bar/HorizontalBarChart.js";
import VerticalBarChart from "../source/shared/Visualizations/Bar/VerticalBarChart.js";

test.before("Load data", async t =>
{
	t.context.data = JSON.parse(await Fs.readFile("tests/data/letters.json"));
});

test("Draw the x-axis and y-axis", async t =>
{
	// Arrange
	const X_TICKS = 12;
	const Y_TICKS = 26;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { ticks: X_TICKS }, y: { ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${HorizontalBarChart.defaults.marginLeft},0)']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS);
	t.true(xTickTexts.length >= X_TICKS);
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS);
	t.true(yTickTexts.length >= Y_TICKS);
});

test("Reverse parameter functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 26;
	const Y_TICKS = 12;

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { x: { ticks: X_TICKS }, y: { ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${VerticalBarChart.defaults.height - VerticalBarChart.defaults.marginBottom})']`);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS);
	t.true(xTickTexts.length >= X_TICKS);
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS);
	t.true(yTickTexts.length >= Y_TICKS);
});

test("X-Axis domainLine property functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { domainLine: true, ticks: X_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");
	const domainLine = xAxisGroup.querySelector("path.domain");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS && xTickLines.length <= X_TICKS + EDGE_TICKS);
	t.true(xTickTexts.length >= X_TICKS && xTickTexts.length <= X_TICKS + EDGE_TICKS);
	t.true(domainLine != null);
});

test("X-Axis label property functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 12;
	const EDGE_TICKS = 2;
	const LABEL = "Frequency %";

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { label: LABEL, ticks: X_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");
	const xLabel = xAxisGroup.querySelector("text[x='934'][y='2.75em']");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS && xTickLines.length <= X_TICKS + EDGE_TICKS);
	t.true(xTickTexts.length >= X_TICKS && xTickTexts.length <= X_TICKS + EDGE_TICKS);
	t.is(xLabel.textContent, LABEL);
});

test("X-Axis location property functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { location: "Top", ticks: X_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.marginTop})']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS && xTickLines.length <= X_TICKS + EDGE_TICKS);
	t.true(xTickTexts.length >= X_TICKS && xTickTexts.length <= X_TICKS + EDGE_TICKS);
});

test("X-Axis tickFormat property functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { tickFormat: "%", ticks: X_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);
	const xTickTexts = xAxisGroup.querySelectorAll("text");

	// Assert
	t.true(xAxisGroup != null);
	t.is(xTickTexts.length, X_TICKS + EDGE_TICKS);

	for (const tick of xTickTexts)
	{
		if (tick.textContent.trim().length > 0)
		{
			t.true(tick.textContent.endsWith("%"));
			t.false(tick.textContent.includes("."));
		}
	}
});

test("X-Axis ticks property functions as expected", async t =>
{
	// Arrange
	const X_TICKS = 6;
	const EDGE_TICKS = 2;

	// Act
	const svg = HorizontalBarChart.draw(t.context.data, { axes: { x: { tickFormat: "%", ticks: X_TICKS } } });

	const svgDom = new JSDOM(svg);
	const xAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(0,${HorizontalBarChart.defaults.height - HorizontalBarChart.defaults.marginBottom})']`);
	const xTickLines = xAxisGroup.querySelectorAll("line");
	const xTickTexts = xAxisGroup.querySelectorAll("text");

	// Assert
	t.true(xAxisGroup != null);
	t.true(xTickLines.length >= X_TICKS && xTickLines.length <= X_TICKS + EDGE_TICKS);
	t.true(xTickTexts.length >= X_TICKS && xTickTexts.length <= X_TICKS + EDGE_TICKS);
});

test("Y-Axis domainLine property functions as expected", async t =>
{
	// Arrange
	const Y_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { domainLine: true, ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");
	const domainLine = yAxisGroup.querySelector("path.domain");

	// Assert
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS && yTickLines.length <= Y_TICKS + EDGE_TICKS);
	t.true(yTickTexts.length >= Y_TICKS && yTickTexts.length <= Y_TICKS + EDGE_TICKS);
	t.true(domainLine != null);
});

test("Y-Axis label property functions as expected", async t =>
{
	// Arrange
	const Y_TICKS = 12;
	const EDGE_TICKS = 2;
	const LABEL = "Frequency %";

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { label: LABEL, ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");
	const yLabel = yAxisGroup.querySelector(`text[x="-${VerticalBarChart.defaults.marginRight}"][y="${VerticalBarChart.defaults.marginTop}"]`);

	// Assert
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS && yTickLines.length <= Y_TICKS + EDGE_TICKS);
	t.true(yTickTexts.length >= Y_TICKS && yTickTexts.length <= Y_TICKS + EDGE_TICKS);
	t.is(yLabel.textContent, LABEL);
});

test("Y-Axis location property functions as expected", async t =>
{
	// Arrange
	const Y_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { location: "Right", ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.width - VerticalBarChart.defaults.marginRight},0)']`);
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");

	// Assert
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS && yTickLines.length <= Y_TICKS + EDGE_TICKS);
	t.true(yTickTexts.length >= Y_TICKS && yTickTexts.length <= Y_TICKS + EDGE_TICKS);
});

test("Y-Axis tickFormat property functions as expected", async t =>
{
	// Arrange
	const Y_TICKS = 12;
	const EDGE_TICKS = 2;

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { tickFormat: "%", ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);
	const yTickTexts = yAxisGroup.querySelectorAll("text");

	// Assert
	t.true(yAxisGroup != null);
	t.is(yTickTexts.length, Y_TICKS + EDGE_TICKS);

	for (const tick of yTickTexts)
	{
		if (tick.textContent.trim().length > 0)
		{
			t.true(tick.textContent.endsWith("%"));
			t.false(tick.textContent.includes("."));
		}
	}
});

test("Y-Axis ticks property functions as expected", async t =>
{
	// Arrange
	const Y_TICKS = 6;
	const EDGE_TICKS = 2;

	// Act
	const svg = VerticalBarChart.draw(t.context.data, { axes: { y: { tickFormat: "%", ticks: Y_TICKS } } });

	const svgDom = new JSDOM(svg);
	const yAxisGroup = svgDom.window.document.querySelector(`svg > g[transform='translate(${VerticalBarChart.defaults.marginLeft},0)']`);
	const yTickLines = yAxisGroup.querySelectorAll("line");
	const yTickTexts = yAxisGroup.querySelectorAll("text");

	// Assert
	t.true(yAxisGroup != null);
	t.true(yTickLines.length >= Y_TICKS && yTickLines.length <= Y_TICKS + EDGE_TICKS);
	t.true(yTickTexts.length >= Y_TICKS && yTickTexts.length <= Y_TICKS + EDGE_TICKS);
});
