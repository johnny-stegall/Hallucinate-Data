import * as D3 from "d3";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	holeRadius: 0,
	strokeColor: "#fff",
	strokeWidth: 1
});

/******************************************************************************
* A pie chart.
******************************************************************************/
export default class PieChart extends IVisualization
{
	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "pie-chart.json";
	}

	/****************************************************************************
	* Draws a pie chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Setup dimensions
		const radius = Math.min(visual.width - visual.marginLeft - visual.marginRight, visual.height - visual.marginBottom - visual.marginTop) / 2;
		const arc = D3.arc()
			.innerRadius(radius * visual.holeRadius)
      .outerRadius(radius - 1);
		const pie = D3.pie()
			.sort(null)
			.value(d => d[visual.valueProperty]);

		// Create the color palette
		const colors = this.getColorPalette(data.map(d => d[visual.labelProperty]), visual.colorPalette);

		// A separate arc generator for labels
		const labelRadius = arc.outerRadius()() * 0.8;
		const arcLabel = D3.arc()
			.innerRadius(labelRadius)
			.outerRadius(labelRadius);
		const arcs = pie(data);

		// Create the SVG element and legend
		const svg = this.constructSvg(visual, colors);

		// Add a sector path for each value
		svg.append("g")
			.attr("transform", `translate(${radius + visual.marginLeft},${radius + visual.marginRight + (visual.legend?.height ?? 0)})`)
			.attr("stroke", visual.strokeColor)
			.attr("stroke-width", visual.strokeWidth)
			.selectAll()
			.data(arcs)
			.join("path")
				.attr("fill", d => colors(d.data[visual.labelProperty]))
				.attr("d", arc)
				.append("title")
					.text(d => `${d.data[visual.labelProperty]}: ${d.data[visual.valueProperty]}`);
			
		// Create a new arc generator to place a label close to the edge, which
		// will show the value if there's enough room
		svg.append("g")
			.attr("transform", `translate(${radius + visual.marginLeft},${radius + visual.marginRight + (visual.legend?.height ?? 0)})`)
			.attr("font-family", visual.fontFamily)
			.attr("font-size", visual.fontSize)
      .attr("text-anchor", "middle")
			.selectAll()
			.data(arcs)
			.join("text")
				.attr("transform", d => `translate(${arcLabel.centroid(d)})`)
				.call(text => text.append("tspan")
					.attr("y", "-0.4em")
					.attr("font-weight", "bold")
					.text(d => d.data[visual.labelProperty]))
				.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
					.attr("x", 0)
					.attr("y", "0.7em")
					.attr("fill-opacity", 0.7)
					.text(d => d.data[visual.valueProperty]));

		return svg.node().outerHTML;
	}
};