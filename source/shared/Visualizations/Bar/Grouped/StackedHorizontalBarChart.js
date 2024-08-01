import * as D3 from "d3";
import IGrouped from "./IGrouped.js";

const DEFAULTS = Object.freeze(
{
	barHeight: 15,
});

/******************************************************************************
* A horizontally stacked bar chart.
******************************************************************************/
export default class StackedHorizontalBarChart extends IGrouped
{
	/****************************************************************************
	* Draws a horizontally stacked bar chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Determine the series that need to be stacked
		const series = D3.stack()
			.keys(D3.union(data.map(d => d[visual.seriesLabelProperty]))) 														// Distinct series keys, in input order
			.value(([, D], key) => D.get(key)[visual.seriesValueProperty]) 														// Get value for each series key and stack
			(D3.index(data, d => d[visual.seriesGroupProperty], d => d[visual.seriesLabelProperty])); // Group by stack then series key

		// Create the color palette
		const colors = this.getColorPalette(series.map(d => d.key), visual.colorPalette);

		// A function to format the value in the tooltip
	  const formatValue = n => isNaN(n) ? "N/A" : n;

		// Prepare the scales for positional and color encodings
		const x = D3.scaleLinear()
			.domain([D3.min([0, D3.min(data, d => d[visual.valueProperty])]), D3.max(series, d => D3.max(d, d => d[1]))])
			.rangeRound(this.calculateRange("x", visual));

		const y = D3.scaleBand()
			.domain(D3.groupSort(data, D => -D3.sum(D, d => d[visual.seriesValueProperty]), d => d[visual.seriesGroupProperty]))
			.range(this.calculateRange("y", visual))
			.padding(0.1);

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		// Append a group for each series, and a rectangle for each element in the
		// series
		svg
			.append("g")
			.selectAll()
			.data(series)
			.join("g")
				.attr("fill", d => colors(d.key))
			.selectAll("rect")
			.data(D => D.map(d => (d[visual.seriesLabelProperty] = D.key, d)))
			.join("rect")
				.attr("x", d => x(d[0]))
				.attr("y", d => y(d.data[0]))
				.attr("height", y.bandwidth())
				.attr("width", d => x(d[1]) - x(d[0]))
			.append("title")
				.text(d => `${d.data[0]} ${d[visual.seriesLabelProperty]}\n${formatValue(d.data[1].get(d[visual.seriesLabelProperty])[visual.seriesValueProperty])}`);

		return svg.node().outerHTML;
	}
};