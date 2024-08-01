import * as D3 from "d3";
import IBarChart from "./IBarChart.js";

const DEFAULTS = Object.freeze(
{
	barHeight: 15,
});

/******************************************************************************
* A horizontal bar chart.
*
* @param {object[]} data The data to visualize.
* @param {object} visual The visualization settings.
* @returns {string} The visualization as SVG.
******************************************************************************/
export default class HorizontalBarChart extends IBarChart
{
	/****************************************************************************
	* Draws a horizontal bar chart.
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
		const x = D3.scaleLinear()
      .domain([D3.min([0, D3.min(data, d => d[visual.valueProperty])]), D3.max(data, d => d[visual.valueProperty])])
      .range(this.calculateRange("x", visual));

		// Declare the y (vertical position) scale
		const y = D3.scaleBand()
      .domain(D3.sort(data, d => -d[visual.valueProperty]).map(d => d[visual.labelProperty]))
      .rangeRound(this.calculateRange("y", visual))
			.padding(0.1);

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		// Create a rectangle for each bar
		svg.append("g")
			.selectAll()
			.data(data)
			.join("rect")
				.attr("fill", d => colors(d[visual.labelProperty]))
				.attr("x", x(0))
				.attr("y", d => y(d[visual.labelProperty]))
				.attr("width", d => x(d[visual.valueProperty]) - x(0))
				.attr("height", y.bandwidth());
  
		// Append a label for each value
		svg.append("g")
			.attr("fill", "white")
			.attr("text-anchor", "end")
			.selectAll()
			.data(data)
			.join("text")
				.attr("x", d => x(d[visual.valueProperty]))
				.attr("y", d => y(d[visual.labelProperty]) + y.bandwidth() / 2)
				.attr("dy", "0.35em")
				.attr("dx", -4)
				.text(d => typeof format != "undefined" ? format(d[visual.valueProperty]) : d[visual.valueProperty])
				.call(text => text.filter(d => x(d[visual.valueProperty]) - x(0) < 20)
					.attr("dx", +4)
					.attr("fill", "currentColor")
					.attr("text-anchor", "start"));

		return svg.node().outerHTML;
	}
};