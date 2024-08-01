import * as D3 from "d3";
import IBarChart from "./IBarChart.js";

const DEFAULTS = Object.freeze(
{
	barWidth: 25,
});

/******************************************************************************
* A vertical bar chart.
*
* @param {object[]} data The data to visualize.
* @param {object} visual The visualization settings.
* @returns {string} The visualization as SVG.
******************************************************************************/
export default class VerticalBarChart extends IBarChart
{
	/****************************************************************************
	* Draws a vertical bar chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Create the color palette
		const colors = this.getColorPalette(data.map(d => d[visual.labelProperty]), visual.colorPalette);

		// Declare the x (horizontal position) scale
		const x = D3.scaleBand()
			.domain(D3.groupSort(data, ([d]) => -d[visual.valueProperty], (d) => d[visual.labelProperty])) // descending order
			.range(this.calculateRange("x", visual))
			.padding(0.1);

		// Declare the y (vertical position) scale
		const y = D3.scaleLinear()
			.domain([D3.min([0, D3.min(data, d => d[visual.valueProperty])]), D3.max(data, (d) => d[visual.valueProperty])])
			.range(this.calculateRange("y", visual, true));

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		// Create a rectangle for each bar
		svg.append("g")
			.selectAll()
			.data(data)
			.join("rect")
				.attr("fill", d => colors(d[visual.labelProperty]))
				.attr("x", d => x(d[visual.labelProperty]))
				.attr("y", d => y(d[visual.valueProperty]))
				.attr("height", d => y(0) - y(d[visual.valueProperty]))
				.attr("width", x.bandwidth());

		return svg.node().outerHTML;
	}
};