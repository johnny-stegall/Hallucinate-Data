# Hallucinate Data
An Azure Function wrapper around the D3 JS visualization library.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjohnny-stegall%2FPolymorph-Image%2Fmaster%2Fazure-deploy.json)

### Combine with Polymorph Image
After drawing a visualization using D3, combine with the [Polymorph Image](https://github.com/johnny-stegall/Polymorph-Image) Azure Function to convert the SVG into another image format.

### What's With the Name?
I'm an avid Dungeons & Dragons player (among other TTRPGs). I've been playing D&D for over 30 years and DMing for 25 years. Nearly all of my side projects use references to TTRPGs and include various snarky comments. Since functions serve a single purpose, I figure names that sound like a D&D spell name fit. It's especially fitting here, because data, like TTRPGs isn't visual and requires imagination to "visualize". Except _visualize_ doesn't fit as a D&D spell name, whereas _hallucinate_ does, and visualizing data is _magical_.

## JSON Schema Validation

JSON schema validation is performed using JSON schema files stored in the Azure Storage Account. The default location for the schema files is in the _schemas_ container.

**You must manually create the _schemas_ container and upload the JSON files into that container** before using the function.

# Usage
Requests are made to the function URL as POST requests. There are main parameters:

- The visualization to draw. This is a URL parameter.
- The rendering parameters, which are held in the "visualization" of the request body.
- The data, which is usually an array, but may be an object (e.g. hierarchical data) in the "data" of the request body.

As an example, drawing a force graph may be done as follows:

	HTTP POST /draw-force-graph

	{
		"visualization":
		{
			"areDirectional": true
		}
		"data": [...]
	}

# API
All visualizations have the following defaults:

- colorPalette: "schemeCategory10"
- fontFamily: "Arial, Helvitica, Sans-Serif"
- fontSize: 14
- height: 1000
- labelProperty: "key"
- marginBottom: 20
- marginLeft: 20
- marginRight: 20
- marginTop: 20
- valueProperty: "value"
- width: 1000

**This means by default, all visualizations are 1000 x 1000 pixels, with 20 pixel margins all around and a font of Arial in 14 pixels and use D3's schemeCategory10 color palette.**

When one of these general defaults collides with a specific visualization's defaults, the visualization defaults override the more general defaults.

Legends, when used, have the following defaults:

- height: 44 + 6
- marginTop: 18
- marginRight: 0
- marginBottom: 16 + 6
- marginLeft: 0,
- ticks: 950 / 64
- tickSize: 6
- width: 950

Swatches, when used, have the following defaults:

- marginLeft: 0
- swatchHeight: 15
- swatchWidth: 15

The following are supported visualizations. 

## Box Plot
- URL: `/draw-box-plot`
- Defaults:
	- axes: bottom and left
	- bins: 10
	- marginBottom: 30
	- marginLeft: 40
	- marginRight: 20
	- marginTop: 20

## Choropleth
- URL: `/draw-choropleth`
- Defaults:
	- bubbles (only if used):
		- maximumRadius: 25
		- minimumRadius: 0	

## Circle Pack
- URL: `/draw-circle-pack`
- Defaults:
	- childrenProperty: "children"

## Force Graph
- URL: `/draw-force-graph`
- Defaults:
	- edges:
		- areDirectional: false
		- colorPalette: "#999"
		- groupProperty: "group"
		- idProperty: "id"
		- labelProperty: "key"
		- labels: "none"
		- lineStyle: "straight"
		- lineWidth: 1
		- sourceProperty: "source"
		- targetProperty: "target"
		- valueProperty: "value"
	- labels:
		- fillColor: "#fff"
		- fontFamily: "Arial, Helvitica, Sans-Serif"
		- fontSize: 10
		- strokeColor: "#333"
		- strokeWidth: 0.25
	- nodes:
		- colorPalette: "schemeCategory10"
		- groupProperty: "group"
		- idProperty: "id"
		- labelProperty: "key"
		- labels: "tooltip"
		- radius: 5
		- valueProperty: "value"
	- useCenteringForce: true
	- usePositionalForce: false

## Grouped Bar Chart
- URL: `/draw-grouped-bar-chart`
- Defaults:
	- axes: bottom and left
	- barWidth: 25
	- marginBottom: 30
	- marginLeft: 40

## Histogram
- URL: `/draw-histogram`
- Defaults:
	- axes: bottom and left
	- bins: 10
	- marginBottom: 30
	- marginLeft: 40

## Horizontal Bar Chart
- URL: `/draw-horizontal-bar-chart`
- Defaults:
	- axes: bottom and left
	- barHeight: 15
	- marginBottom: 30
	- marginLeft: 40

## Line Chart
- URL: `/draw-line-chart`
- Defaults:
	- axes: bottom and left
	- groupProperty: "group"
	- marginBottom: 30
	- marginLeft: 40

## Pie Chart
- URL: `/draw-pie-chart`
- Defaults:
	- holeRadius: 0
	- strokeColor: "#fff"
	- strokeWidth: 1

## Scatterplot
- URL: `/draw-scatterplot`
- Defaults
	- axes: bottom and left
	- marginBottom: 30
	- marginLeft: 40
	- valuePropertyX: "valueX"
	- valuePropertyY: "valueY"

## Stacked Horizontal Bar Chart
- URL: `/draw-stacked-horizontal-bar-chart`
- Defaults:
	- axes: bottom and left
	- barHeight: 15
	- marginBottom: 30
	- marginLeft: 40

## Stacked Vertical Bar Chart
- URL: `/draw-stacked-vertical-bar-chart`
- Defaults:
	- axes: bottom and left
	- barWidth: 25
	- marginBottom: 30
	- marginLeft: 40

## Sunburst
- URL: `/draw-sunburst`
- Defaults:
	- childrenProperty: "children"

## Treemap
- URL: `/draw-treemap`
- Defaults:
	- childrenProperty: "children"
	- hierarchyDelimiter: "/"
	- pathProperty: "path"
	- tilingMethod: "Squarify"

## Vertical Bar Chart
- URL: `/draw-vertical-bar-chart`
- Defaults:
	- axes: bottom and left
	- barWidth: 25
	- marginBottom: 30
	- marginLeft: 40

## Word Cloud
- URL: `/draw-word-cloud`
- Defaults:
	- fontScale: 5
	- labelProperty: "word"
	- rotate: 0
	- wordPadding: 5