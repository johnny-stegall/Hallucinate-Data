import * as D3 from "d3";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	axes:
	{
		x: { location: "Bottom" },
		y: { location: "Left" }
	},
	marginBottom: 30,
	marginLeft: 40,
	valuePropertyX: "valueX",
	valuePropertyY: "valueY"
});

/******************************************************************************
* A scatterplot.
******************************************************************************/
export default class Scatterplot extends IVisualization
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
		return "scatterplot.json";
	}

	/****************************************************************************
	* Draws a scatterplot.
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
      .domain([D3.min([0, D3.min(data, d => d[visual.valuePropertyX])]), D3.max(data, d => d[visual.valuePropertyX])])
      .range(this.calculateRange("x", visual));

		const y = D3.scaleLinear()
      .domain([D3.min([0, D3.min(data, d => d[visual.valuePropertyY])]), D3.max(data, d => d[visual.valuePropertyY])])
			.range(this.calculateRange("y", visual, true));

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y);

		// Create the grid
		svg.append("g")
			.attr("stroke", "currentColor")
			.attr("stroke-opacity", 0.1)
			.call(g => g.append("g")
				.selectAll("line")
				.data(x.ticks())
				.join("line")
					.attr("x1", d => 0.5 + x(d))
					.attr("x2", d => 0.5 + x(d))
					.attr("y1", visual.marginTop)
					.attr("y2", visual.height - visual.marginBottom))
			.call(g => g.append("g")
				.selectAll("line")
				.data(y.ticks())
				.join("line")
					.attr("y1", d => 0.5 + y(d))
					.attr("y2", d => 0.5 + y(d))
					.attr("x1", visual.marginLeft)
					.attr("x2", visual.width - visual.marginRight));

		// Add a layer of dots
		svg.append("g")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("fill", "none")
			.selectAll("circle")
			.data(data)
			.join("circle")
				.attr("cx", d => x(d[visual.valuePropertyX]))
				.attr("cy", d => y(d[visual.valuePropertyY]))
				.attr("r", 3);

		// Add a layer of labels
		svg.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.selectAll("text")
			.data(data)
			.join("text")
				.attr("dy", "0.35em")
				.attr("x", d => x(d[visual.valuePropertyX]) + 7)
				.attr("y", d => y(d[visual.valuePropertyY]))
				.text(d => d[visual.labelProperty]);

		return svg.node().outerHTML;
	}
};