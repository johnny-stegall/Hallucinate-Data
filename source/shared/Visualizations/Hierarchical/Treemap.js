import Crypto from "crypto";
import * as D3 from "d3";
import IHierarchical from "./IHierarchical.js";

const DEFAULTS = Object.freeze(
{
	hierarchyDelimiter: "/",
	pathProperty: "path",
	tilingMethod: "Squarify"
});

/******************************************************************************
* A treemap.
******************************************************************************/
export default class Treemap extends IHierarchical
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
		return "treemap.json";
	}

	/****************************************************************************
	* Draws a treemap.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual);

		// Stratify
		const stratifiedData = D3.stratify()
			.path(d => d[visual.pathProperty])
			(data);

		// Specify the color scale
		const colors = this.getColorPalette(stratifiedData.children.map(d => d.id.split(visual.hierarchyDelimiter).at(-1)), visual.colorPalette);

		// Compute the layout
		const root = D3.treemap()
			.tile(D3[`treemap${visual.tilingMethod}`])
			.size([visual.width - visual.marginLeft - visual.marginRight, visual.height - visual.marginBottom - visual.marginTop - (visual.legend?.height ?? 0)])
			.padding(1)
			.round(true)
		(D3.hierarchy(stratifiedData)
			.sum(d => d.data[visual.valueProperty])
			.sort((a, b) => b.value - a.value));

			// Create the SVG element and legend
		const svg = this.constructSvg(visual, colors);

		// Add a cell for each leaf of the hierarchy, with a link to the corresponding GitHub page
		const leaf = svg
			.selectAll()
			.data(root.leaves())
			.join("a")
				.attr("transform", d => `translate(${d.x0},${d.y0 + visual.marginTop + (visual.legend?.height ?? 0)})`);

		// Append a tooltip
		const format = D3.format(",d");
		const regex = new RegExp(`${visual.hierarchyDelimiter}`, "g");
		leaf
			.append("title")
				.text(d => `${d.data.id.slice(1).replace(regex, ".")}\n${format(d.value)}`);

		// Append a color rectangle
		leaf
			.append("rect")
				.attr("id", d => (d.leafId = Crypto.randomUUID()).leafId)
				.attr("fill", d => colors(d.data.id.split(visual.hierarchyDelimiter).at(2)))
				.attr("fill-opacity", 0.6)
				.attr("width", d => d.x1 - d.x0)
				.attr("height", d => d.y1 - d.y0);

		// Append a clipPath to ensure text does not overflow
		leaf
			.append("clipPath")
				.attr("id", d => (d.clipId = Crypto.randomUUID()).clipId)
				.append("use")
					.attr("href", d => `#${d.leafId}`);

		// Append multiline text; the last line is value and has a specific formatting
		leaf
			.append("text")
				.attr("clip-path", d => d.clipId)
			.selectAll("tspan")
			.data(d => d.data.id.split(visual.hierarchyDelimiter).at(-1).split(" ").concat(format(d.value)))
			.join("tspan")
				.attr("x", 3)
				.attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
				.attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
				.text(d => d);

		return svg.node().outerHTML;
	}
};