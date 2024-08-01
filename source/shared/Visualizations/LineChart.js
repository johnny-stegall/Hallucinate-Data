import * as D3 from "d3";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	axes:
	{
		x: { location: "Bottom" },
		y: { location: "Left" }
	},
	groupProperty: "group",
	marginBottom: 30,
	marginLeft: 40
});

/******************************************************************************
* A line chart.
******************************************************************************/
export default class LineChart extends IVisualization
{
	/******************************************************************************
	* Gets the defaults.
	*
	* @returns {object} The visualization defaults.
	******************************************************************************/
	static get defaults()
	{
		return { ...super.defaults, ...DEFAULTS };
	}

	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "line-chart.json";
	}

	/****************************************************************************
	* Draws a line chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Strings are no good for values, so expect dates
		if (typeof data[0][visual.labelProperty] === "string")
			data.forEach(d => d[visual.labelProperty] = new Date(d[visual.labelProperty]));

		// Create the color palette
		const colors = this.getColorPalette(data.map(d => d[visual.groupProperty]), visual.colorPalette);

		// Declare the x (horizontal position) scale
		const x = D3.scaleUtc()
			.domain(D3.extent(data, d => d[visual.labelProperty]))
			.range(this.calculateRange("x", visual));
	
		// Declare the y (vertical position) scale
		const y = D3.scaleLinear()
			.domain([D3.min([0, D3.min(data, d => d[visual.valueProperty])]), D3.max(data, d => d[visual.valueProperty])])
			.range(this.calculateRange("y", visual, true));

		// Compute the points in pixel space as [x, y, z], where z is the name of the series
		const points = data.map(d => [x(d[visual.labelProperty]), y(d[visual.valueProperty]), d[visual.groupProperty]]);
		const groups = D3.rollup(points, v => Object.assign(v, { z: v[0][2] }), d => d[2]);

		// Declare the line generator
		const line = D3.line();

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

	  svg.append("g")
			.attr("transform", `translate(${visual.marginLeft},${visual.marginRight + (visual.legend?.height ?? 0)})`)
			.attr("fill", "none")
			.attr("stroke-width", 1.5)
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.selectAll("path")
			.data(groups.values())
			.join("path")
				.attr("stroke", d => colors(d.z))
				.attr("d", line);
	
		return svg.node().outerHTML;
	}
};