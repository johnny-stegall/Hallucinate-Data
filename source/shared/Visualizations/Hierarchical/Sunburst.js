import * as D3 from "d3";
import IHierarchical from "./IHierarchical.js";

/******************************************************************************
* A sunburst.
******************************************************************************/
export default class Sunburst extends IHierarchical
{
	/****************************************************************************
	* Draws a sunburst diagram.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual);

		// Setup dimensions
		const radius = Math.min(visual.width - visual.marginLeft - visual.marginRight, visual.height - visual.marginBottom - visual.marginTop) / 2;
		const arc = D3.arc()
			.startAngle(d => d.x0)
			.endAngle(d => d.x1)
			.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
			.padRadius(radius / 2)
			.innerRadius(d => d.y0)
			.outerRadius(d => d.y1 - 1);

		// Create the color palette
		const colors = this.getColorPalette(data[visual.childrenProperty].map(d => d[visual.labelProperty]), visual.colorPalette);

		// Prepare the layout
		const partition = data => D3.partition()
			.size([2 * Math.PI, radius])
		(D3.hierarchy(data, d => d[visual.childrenProperty])
			.sum(d => d[visual.valueProperty])
			.sort((a, b) => b.value - a.value));

		const root = partition(data);

		// Create the SVG element and legend
		const svg = this.constructSvg(visual, colors);

		// Add an arc for each element, with a title for tooltips
		const format = D3.format(",d");
		svg.append("g")
			.attr("transform", `translate(${radius + visual.marginLeft},${radius + visual.marginRight + (visual.legend?.height ?? 0)})`)
			.attr("fill-opacity", 0.6)
			.selectAll("path")
			.data(root.descendants().filter(d => d.depth))
			.join("path")
				.attr("fill", d =>
				{
					while (d.depth > 1)
						d = d.parent;
					
					return colors(d.data[visual.labelProperty]);
				})
				.attr("d", arc)
			.append("title")
				.text(d => `${d.ancestors().map(d => d.data[visual.labelProperty]).reverse().join("/")}\n${format(d.value)}`);

		// Add a label for each element
		svg.append("g")
			.attr("transform", `translate(${radius + visual.marginLeft},${radius + visual.marginRight + (visual.legend?.height ?? 0)})`)
			.attr("pointer-events", "none")
			.attr("text-anchor", "middle")
			.attr("font-size", 10)
			.attr("font-family", "sans-serif")
			.selectAll("text")
			.data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
			.join("text")
				.attr("transform", function(d) {
					const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
					const y = (d.y0 + d.y1) / 2;
					return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
				})
				.attr("dy", "0.35em")
				.text(d => d.data[visual.labelProperty]);

		return svg.node().outerHTML;
	}
};