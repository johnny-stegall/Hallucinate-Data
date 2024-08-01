import { createCanvas } from "canvas";
import D3Cloud from "d3-cloud";
import IVisualization from "./IVisualization.js";

const DEFAULTS = Object.freeze(
{
	fontScale: 5,
	labelProperty: "word",
	rotate: 0,
	wordPadding: 5
});

/******************************************************************************
* A word cloud.
******************************************************************************/
export default class WordCloud extends IVisualization
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
		return "word-cloud.json";
	}

	/****************************************************************************
	* Draws a word cloud.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static async draw(data, visual)
	{
		visual = super.applyDefaults(visual, { ...super.defaults, ...DEFAULTS });

		// Create the color palette
		const colors = this.getColorPalette(data.map(d => d[visual.labelProperty]), visual.colorPalette);

		// Create the SVG container
		const svg = this.constructSvg(visual, colors)
			.attr("text-anchor", "middle");
	
		const g = svg.append("g")
			.attr("transform", `translate(${visual.marginLeft},${visual.marginTop})`);
		
		const cloud = D3Cloud()
			.canvas(() => createCanvas(visual.width, visual.height))
			.size([visual.width - visual.marginLeft - visual.marginRight, visual.height - visual.marginTop - visual.marginBottom])
			.words(data.map(d =>
			{
				return {
					text: d[visual.labelProperty],
					size: d[visual.valueProperty]
				};
			}))
			.padding(visual.wordPadding)
			.rotate(() => (~~(Math.random() * 6) - 3) * visual.rotate)
			.font(visual.fontFamily)
			.fontSize(d => Math.sqrt(d.size) * visual.fontScale)
			.on("word", ({size, x, y, rotate, text}) =>
			{
				g.append("text")
					.datum(text)
					.attr("font-size", size)
					.attr("fill", d => colors(d))
					.attr("transform", `translate(${x + visual.marginLeft},${y + visual.marginTop}) rotate(${rotate})`)
					.text(text);
			});

		cloud.start();
		return svg.node().outerHTML;
	}
};