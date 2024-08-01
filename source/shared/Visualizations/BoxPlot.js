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
	marginLeft: 40,
	marginRight: 20,
	marginTop: 20
});

/******************************************************************************
* A box plot.
******************************************************************************/
export default class BoxPlot extends IVisualization
{
	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "box-plot.json";
	}

	/****************************************************************************
	* Draws a box plot.
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
			.value(d => d[visual.labelProperty])
		(data)
			.map(bin =>
			{
				bin.sort((a, b) => a[visual.valueProperty] - b[visual.valueProperty]);
				const values = bin.map(d => d[visual.valueProperty]);
				const min = values[0];
				const max = values[values.length - 1];
				const q1 = D3.quantile(values, 0.25);
				const q2 = D3.quantile(values, 0.50);
				const q3 = D3.quantile(values, 0.75);
				const iqr = q3 - q1;	// Interquartile range
				const r0 = Math.max(min, q1 - iqr * 1.5);
				const r1 = Math.min(max, q3 + iqr * 1.5);
				bin.quartiles = [q1, q2, q3];
				bin.range = [r0, r1];
				bin.outliers = bin.filter(v => v[visual.valueProperty] < r0 || v[visual.valueProperty] > r1);
				return bin;
			});

		// Create the color palette
		const colors = this.getColorPalette(Object.keys(bins), visual.colorPalette);

		// Declare the x (horizontal position) scale
		const x = D3.scaleLinear()
			.domain([D3.min(bins, d => d.x0), D3.max(bins, d => d.x1)])
			.rangeRound(this.calculateRange("x", visual));

		// Declare the y (vertical position) scale
		const y = D3.scaleLinear()
			.domain([D3.min(bins, d => d.range[0]), D3.max(bins, d => d.range[1])]).nice()
			.range(this.calculateRange("x", visual, true));

		// Create the SVG element, axes, and legend
		const svg = this.constructSvg(visual, colors, x, y)
			.attr("text-anchor", "middle");

		// Create a visual representation for each bin
		const g = svg.append("g")
			.selectAll("g")
			.data(bins)
			.join("g");

		// Range
		g.append("path")
			.attr("stroke", "currentColor")
			.attr("d", d => `M${x((d.x0 + d.x1) / 2)},${y(d.range[1])} V${y(d.range[0])}`);

		// Quartiles
		g.append("path")
			.attr("fill", (bin, index, element) => colors(index))
			.attr("d", d => `M${x(d.x0) + 1},${y(d.quartiles[2])} H${x(d.x1)} V${y(d.quartiles[0])} H${x(d.x0) + 1} Z`);

		// Median
		g.append("path")
			.attr("stroke", "currentColor")
			.attr("stroke-width", 2)
			.attr("d", d => `M${x(d.x0) + 1},${y(d.quartiles[1])} H${x(d.x1)}`);

		// Outliers, with a bit of jitter
		g.append("g")
				.attr("fill", (bin, index, element) => colors(index))
				.attr("fill-opacity", 0.2)
				.attr("stroke", "none")
				.attr("transform", d => `translate(${x((d.x0 + d.x1) / 2)},0)`)
			.selectAll("circle")
			.data(d => d.outliers)
			.join("circle")
				.attr("r", 2)
				.attr("cx", () => (Math.random() - 0.5) * 4)
				.attr("cy", d => y(d[visual.valueProperty]));

		return svg.node().outerHTML;
	}
};