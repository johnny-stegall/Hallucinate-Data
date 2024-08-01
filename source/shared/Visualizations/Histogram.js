import * as D3 from "d3";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	axes:
	{
		x: { location: "Bottom" },
		y: { location: "Left" }
	},
	bins: 10,
	marginBottom: 30,
	marginLeft: 40
});

/******************************************************************************
* A histogram.
******************************************************************************/
export default class Histogram extends IVisualization
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
		return "histogram.json";
	}

	/****************************************************************************
	* Draws a histogram.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Bin the data and derive the values (inter-quartile range, outliers…) 
		const bins = D3.bin()
			.thresholds(visual.bins)
			.value(d => d[visual.valueProperty])
			(data);

		// Create the color palette
		const colors = this.getColorPalette(Object.keys(bins), visual.colorPalette);

		// Declare the x (horizontal position) scale
		const x = D3.scaleLinear()
			.domain([bins[0].x0, bins[bins.length - 1].x1])
			.range(this.calculateRange("x", visual));
	
		// Declare the y (vertical position) scale
		const y = D3.scaleLinear()
			.domain([0, D3.max(bins, (d) => d.length)])
			.range(this.calculateRange("y", visual, true));
	
		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		// Add a rect for each bin
		svg.append("g")
			.selectAll()
			.data(bins)
			.join("rect")
				.attr("fill", (bin, index, element) => colors(index))
				.attr("x", (d) => x(d.x0) + 1)
				.attr("width", (d) => x(d.x1) - x(d.x0) - 1)
				.attr("y", (d) => y(d.length))
				.attr("height", (d) => y(0) - y(d.length));
	
		return svg.node().outerHTML;
	}
};