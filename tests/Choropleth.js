import { promises as Fs } from "fs";
import test from "ava";
import { JSDOM } from "jsdom";
import Choropleth from "../source/shared/Visualizations/Choropleth.js";
import TopoJson from "topojson";

test.before("Load data", async t =>
{
	t.context.countyData = JSON.parse(await Fs.readFile("tests/data/unemployment-county-state.json"));
	t.context.stateData = JSON.parse(await Fs.readFile("tests/data/unemployment-state.json"));
	t.context.unitedStates = JSON.parse(await Fs.readFile("tests/data/united-states.json"));
	t.context.world = JSON.parse(await Fs.readFile("tests/data/world.json"));
	t.context.worldData = JSON.parse(await Fs.readFile("tests/data/hale.json"));
});

test("Draw a choropleth", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/defaults-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/defaults.svg";
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];
	const data = Array.from(t.context.stateData, data =>
	{
		const newRecord = { ...data, key: data.rank, value: data.rate };
		delete newRecord.rank;
		delete newRecord.rate;
		return newRecord;
	});

	// Act
	const svg = Choropleth.draw(data, { geographies, geographyProperty: "name" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth labelProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/label-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/label-property.svg";
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];
	const data = Array.from(t.context.stateData, data =>
	{
		const newRecord = { ...data, value: data.rate };
		delete newRecord.division;
		delete newRecord.rate;
		return newRecord;
	});

	// Act
	const svg = Choropleth.draw(data, { geographies, geographyProperty: "name", labelProperty: "rank" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth valueProperty property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/value-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/value-property.svg";
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];
	const data = Array.from(t.context.stateData, data =>
	{
		const newRecord = { ...data, key: data.rank };
		return newRecord;
	});

	// Act
	const svg = Choropleth.draw(data, { geographies, geographyProperty: "name", valueProperty: "rate" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth handles many small paths", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/tiny-paths-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/tiny-paths.svg";
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.counties),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.countyData, { geographies, geographyProperty: "county", valueProperty: "rate"});
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth can do bubbles", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/bubbles-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/bubbles.svg";
	const geographies =
	[
		{
			colorPalette: "#aaa",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.counties),
			type: "Feature"
		},
		{
			colorPalette: "#aaa",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.countyData, { bubbles: { colorPalette: "#aa0000", geographyProperty: "id", valueProperty: "rate" }, geographies, geographyProperty: "state", valueProperty: "rate"});
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth can do bubbles with non-data specific geography", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/bubbles-no-data-geography-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/bubbles-no-data-geography.svg";
	const geographies =
	[
		{
			colorPalette: "#aaa",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.counties),
			type: "Feature"
		},
		{
			colorPalette: "#aaa",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.nation),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.countyData, { bubbles: { colorPalette: "#aa0000", geographyProperty: "id", valueProperty: "rate" }, geographies, geographyProperty: "state", valueProperty: "rate"});
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth bubbles minimumRadius property functions as expected.", async t =>
{
	// Arrange
	const MINIMUM_RADIUS = 5;
	const geographies =
	[
		{
			colorPalette: "#ddd",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.counties),
			type: "Feature"
		},
		{
			colorPalette: "#ddd",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.nation),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.countyData, { bubbles: { colorPalette: "#aa0000", geographyProperty: "id", minimumRadius: MINIMUM_RADIUS, valueProperty: "rate" }, geographies, geographyProperty: "state", valueProperty: "rate"});

	const svgDom = new JSDOM(svg);
	const bubbles = Array.from(svgDom.window.document.querySelectorAll(`svg circle`));

	// Assert
	t.true(bubbles.every(b => parseInt(b.getAttribute("r")) >= MINIMUM_RADIUS));
});

test("Choropleth bubbles maximumRadius property functions as expected.", async t =>
{
	// Arrange
	const MAXIMUM_RADIUS = 5;
	const geographies =
	[
		{
			colorPalette: "#ddd",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.counties),
			type: "Feature"
		},
		{
			colorPalette: "#ddd",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.nation),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.countyData, { bubbles: { colorPalette: "#aa0000", geographyProperty: "id", maximumRadius: MAXIMUM_RADIUS, valueProperty: "rate" }, geographies, geographyProperty: "state", valueProperty: "rate"});

	const svgDom = new JSDOM(svg);
	const bubbles = Array.from(svgDom.window.document.querySelectorAll(`svg circle`));

	// Assert
	t.true(bubbles.every(b => parseInt(b.getAttribute("r")) <= MAXIMUM_RADIUS));
});

test("Choropleth projection fit property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/projection-fit-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/projection-fit-property.svg";
	const geographies =
	[
		{
			colorPalette: "interpolateYlGnBu",
			geoJson: TopoJson.feature(t.context.world, t.context.world.objects.countries),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.world, t.context.world.objects.countries, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.worldData, { geographies, geographyProperty: "name", projection: { fit: { shape: "Sphere", bottom: Choropleth.defaults.height, left: 0, right: Choropleth.defaults.width, top: 0 }, type: "geoEqualEarth" }, valueProperty: "hale" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth projection type property functions as expected.", async t =>
{
	// Arrange
	const EXPECTED_DOM = await JSDOM.fromFile("tests/results/Choropleth/projection-type-property-Expected.svg");
	const OUTPUT_FILE = "tests/results/Choropleth/projection-type-property.svg";
	const geographies =
	[
		{
			colorPalette: "interpolateYlGnBu",
			geoJson: TopoJson.feature(t.context.world, t.context.world.objects.countries),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.world, t.context.world.objects.countries, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.worldData, { geographies, geographyProperty: "name", projection: { fit: { shape: "Sphere", bottom: Choropleth.defaults.height, left: 0, right: Choropleth.defaults.width, top: 0 }, type: "geoEquirectangular" }, valueProperty: "hale" });
	await Fs.writeFile(OUTPUT_FILE, svg);

	const svgDom = new JSDOM(svg);
	const featurePathElements = svgDom.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const expectedFeaturePathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path:not([fill="${geographies[1].colorPalette}"])`);
	const meshPathElements = svgDom.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);
	const expectedMeshPathElements = EXPECTED_DOM.window.document.querySelectorAll(`svg path[fill="${geographies[1].colorPalette}"]`);

	// Assert
	t.is(featurePathElements.length, expectedFeaturePathElements.length);
	t.is(meshPathElements.length, expectedMeshPathElements.length);
});

test("Choropleth legend functions as expected.", async t =>
{
	// Arrange
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.stateData, { geographies, geographyProperty: "name", labelProperty: "rank", legend: { type: "Legend" }, valueProperty: "rate" });

	const svgDom = new JSDOM(svg);
	const legendSvgElement = svgDom.window.document.querySelector("svg > svg");
	const colorRamp = legendSvgElement.querySelectorAll("g > rect");

	// Assert
	t.true(legendSvgElement != null);
	t.true(colorRamp.length > 0)
});

test("Choropleth swatches function as expected.", async t =>
{
	// Arrange
	const geographies =
	[
		{
			colorPalette: "schemeBlues[9]",
			geoJson: TopoJson.feature(t.context.unitedStates, t.context.unitedStates.objects.states),
			type: "Feature"
		},
		{
			colorPalette: "#fff",
			geoJson: TopoJson.mesh(t.context.unitedStates, t.context.unitedStates.objects.states, (a, b) => a !== b),
			type: "Mesh"
		}
	];

	// Act
	const svg = Choropleth.draw(t.context.stateData, { geographies, geographyProperty: "name", legend: { type: "Swatches" }, valueProperty: "rate" });

	const svgDom = new JSDOM(svg);
	const swatches = svgDom.window.document.querySelectorAll("span.swatches");

	// Assert
	t.true(swatches.length > 0)
});