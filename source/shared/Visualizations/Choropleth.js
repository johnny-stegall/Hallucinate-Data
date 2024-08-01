import * as D3 from "d3";
import IVisualization from "./IVisualization.js";
import Legend from "./Legend.js";

const DEFAULTS = Object.freeze(
{
	bubbles:
	{
		maximumRadius: 25,
		minimumRadius: 0	
	}
});

/******************************************************************************
* A geographic map that uses colors and/or bubbles to convey information.
******************************************************************************/
export default class Choropleth extends IVisualization
{
	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "choropleth.json";
	}

	/****************************************************************************
	* Draws a diagram using geography.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		const merged = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });
		merged.bubbles = { ...DEFAULTS.bubbles, ...visual.bubbles };
		visual = merged;

		const geoMap = new Map(data.map(d => [d[visual.geographyProperty], d]));
		
		// Create paths from geography GeoJSON data
		let projection;

		// Construct the geography path generator
		if (typeof visual.projection?.fit?.shape !== "undefined")
			projection = D3[visual.projection.type]().fitExtent([[visual.projection.fit.left, visual.projection.fit.top], [visual.projection.fit.right, visual.projection.fit.bottom]], { type: visual.projection.fit.shape });

		const geoPath = D3.geoPath(projection);

		// Create the SVG container
		let legendExists = false;
		const svg = this.constructSvg(visual);

		// Loop through the geographies and draw the features
		for (const geography of visual.geographies)
		{
			// Create the color palette
			const colors = this.getColorPalette(data.map(d => d[visual.valueProperty]), geography.colorPalette);
			const geoGroup = svg.append("g")
				.attr("transform", d => `translate(${visual.marginLeft},${visual.marginTop + (visual.legend?.height ?? 0)})`);

			if (geography.type === "Feature")
			{
				if (!legendExists)
				{
					// Add a legend or swatches
					Legend.createLegend(svg, colors, visual);
					legendExists = true;
				}

				// Build the geographic feature shapes and add a tooltip for each
				// feature using the name, and keying data from the name
				geoGroup.selectAll("path")
					.data(geography.geoJson.features)
					.join("path")
						.attr("fill", d =>
						{
							const geoData = geoMap.has(d.properties.name)
								? geoMap.get(d.properties.name)[visual.valueProperty]
								: geoMap.has(d.id)
									? geoMap.get(d.id)[visual.valueProperty]
									: undefined;
							return colors(geoData);
						})
						.attr("d", geoPath)
						.append("title")
							.text(d =>
							{
								const geoData = geoMap.has(d.properties.name)
								? geoMap.get(d.properties.name)
								: geoMap.has(d.id)
									? geoMap.get(d.id)
									: undefined;
								return (geoData != null)
									? `${d.properties.name}\n${geoData[visual.valueProperty]}`
									: d.properties.name;
							});
			}
			else if (geography.type === "Mesh")
			{
				geoGroup.append("path")
					.datum(geography.geoJson, (a, b) => a !== b)
					.attr("fill", "none")
					.attr("stroke", d => colors(d))
					.attr("stroke-linejoin", "round")
					.attr("d", geoPath);
			}
		}

		// If bubbles were specified, draw bubbles on top of the features
		if (visual.bubbles.geographyProperty)
		{
			const bubbleColors = this.getColorPalette(data.map(d => d[visual.bubbles.valueProperty]), visual.bubbles.colorPalette);
			const hiddenX = (visual.viewBox?.split(",")[0] ?? 0) - (visual.bubbles.maximumRadius * 2);
			const hiddenY = (visual.viewBox?.split(",")[1] ?? 0) - (visual.bubbles.maximumRadius * 2);

			// Setup dimensions
			const radius = D3.scaleSqrt([0, D3.max(data, d => d[visual.bubbles.valueProperty])], [visual.bubbles.minimumRadius, visual.bubbles.maximumRadius]);
			const centroid = feature =>
			{
				const path = D3.geoPath();
				const geoFeature = visual.geographies[0].geoJson.features.find(f => f.id === feature || f.properties.name === feature);
				return geoFeature != null
					? path.centroid(geoFeature)
					: [hiddenX, hiddenY];
			};

			// Add a circle for each geographic feature
			svg.append("g")
				.attr("transform", d => `translate(${visual.marginLeft},${visual.marginTop + (visual.legend?.height ?? 0)})`)
				.attr("fill-opacity", 0.5)
				.attr("stroke", "#fff")
				.attr("stroke-width", 0.5)
				.selectAll()
				.data(data)
				.join("circle")
					.attr("transform", d => `translate(${centroid(d[visual.bubbles.geographyProperty])})`)
					.attr("fill", d => bubbleColors(d[visual.bubbles.valueProperty]))
					.attr("r", d => radius(d[visual.bubbles.valueProperty] ?? 0))
					.append("title")
						.text(d => `${d[visual.bubbles.geographyProperty]}: ${d[visual.bubbles.geographyProperty]}`);
		}
	
		return svg.node().outerHTML;
	}
};