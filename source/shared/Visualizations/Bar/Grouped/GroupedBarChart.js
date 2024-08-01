import * as D3 from "d3";
import IGrouped from "./IGrouped.js";

const DEFAULTS = Object.freeze(
{
	barWidth: 25,
});

/******************************************************************************
* A grouped bar chart.
******************************************************************************/
export default class GroupedBarChart extends IGrouped
{
	/****************************************************************************
	* Draws a grouped bar chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Create the color palette
		const keys = new Set(data.map(d => d[visual.seriesLabelProperty]));
		const colors = this.getColorPalette(keys, visual.colorPalette);

		// Prepare the scales for positional
		const fx = D3.scaleBand()
			.domain(new Set(data.map(d => d[visual.seriesGroupProperty])))
			.rangeRound(this.calculateRange("x", visual));

		const x = D3.scaleBand()
			.domain(keys)
			.rangeRound([0, fx.bandwidth()])
			.padding(0.05);

		// Y encodes the height of the bar
		const y = D3.scaleLinear()
			.domain([D3.min([0, D3.min(data, d => d[visual.seriesValueProperty])]), D3.max(data, d => d[visual.seriesValueProperty])]).nice()
			.rangeRound(this.calculateRange("y", visual, true));

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		svg
			.append("g")
			.selectAll()
			.data(D3.group(data, d => d[visual.seriesGroupProperty]))
			.join("g")
				.attr("transform", ([group]) => `translate(${fx(group)},0)`)
				.selectAll()
				.data(([, d]) => d)
				.join("rect")
					.attr("x", d => x(d[visual.seriesLabelProperty]))
					.attr("y", d => y(d[visual.seriesValueProperty]))
					.attr("width", x.bandwidth())
					.attr("height", d => y(0) - y(d[visual.seriesValueProperty]))
					.attr("fill", d => colors(d[visual.seriesLabelProperty]));
	
		return svg.node().outerHTML;
	}
};