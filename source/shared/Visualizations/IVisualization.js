import { strict as assert } from "assert";
import * as D3 from "d3";
import { JSDOM } from "jsdom";
import Axes from "./Axes.js";
import Legend from "./Legend.js";

const DEFAULTS = Object.freeze(
{
	colorPalette: "schemeCategory10",
	fontFamily: "Arial, Helvitica, Sans-Serif",
	fontSize: 14,
	height: 1000,
	labelProperty: "key",
	marginBottom: 20,
	marginLeft: 20,
	marginRight: 20,
	marginTop: 20,
	valueProperty: "value",
	width: 1000
});
const DEFAULTS_AXES = Object.freeze(
{
	x: { location: "Bottom" },
	y: { location: "Left" }
});
const DEFAULTS_LEGEND = Object.freeze(
{
	height: 44 + 6,
	marginTop: 18,
	marginRight: 0,
	marginBottom: 16 + 6,
	marginLeft: 0,
	ticks: 950 / 64,
	tickSize: 6,
	width: 950
});
const DEFAULTS_SWATCHES = Object.freeze(
{
  marginLeft: 0,
  swatchHeight: 15,
  swatchWidth: 15
});
const HTML_FRAGMENT = "<!DOCTYPE html><html><body></body></html>";
const WORD_REGEX = /(?!I){0,1}(?:[A-Z]{1})[a-z]+/g;

/******************************************************************************
* A contract to be implemented by all visualizations.
******************************************************************************/
export default class IVisualization
{
	/******************************************************************************
	* Gets the defaults.
	*
	* @returns {object} The visualization defaults.
	******************************************************************************/
	static get defaults()
	{
		return DEFAULTS;
	}

	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schemaFile()
	{
		const prototypeClass = Object.getPrototypeOf(this).name;
		const words = prototypeClass === "IVisualization"
			? this.name.match(WORD_REGEX)
			: prototypeClass.match(WORD_REGEX);
		const schemaName = words.join("-").toLowerCase();	
		return `${schemaName}.json`;
	}

	/******************************************************************************
	* Draws the visualization.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	******************************************************************************/
	static draw(data, visual)
	{
		throw new TypeError("Not implemented.");
	}

	/******************************************************************************
	* Applies basic visualization default settings as well as axes and legends.
	*
	* @param {object} visual The visualization settings.
	* @param {object} [defaults] The default settings.
	* @returns {object} The visualization settings with defaults applied.
	******************************************************************************/
	static applyDefaults(visual, defaults = DEFAULTS)
	{
		const merged = { ...defaults, ...visual };

		if (visual?.axes)
		{
			merged.axes =
			{
				x: { ...DEFAULTS_AXES.x, ...visual.axes.x },
				y: { ...DEFAULTS_AXES.y, ...visual.axes.y }
			};
		}

		if (visual?.legend?.type === "Legend")
			merged.legend = { ...DEFAULTS_LEGEND, ...visual.legend };
		else if (visual?.legend?.type === "Swatches")
			merged.legend = { ...DEFAULTS_SWATCHES, ...visual.legend };

		return merged;
	}

	/******************************************************************************
	* Calculates the range for the x-axis or y-axis.
	*
	* @param {string} axis The axis.
	* @param {object} visual The visualization settings.
	* @param {boolean} [reverse] True to reverse the range, false otherwise.
	* @returns {number[]} The range for the axis.
	******************************************************************************/
	static calculateRange(axis, visual, reverse)
	{
		assert(axis === "x" || axis === "y", `Invalid axis: ${axis}. Must be "x" or "y".`);

		if (axis === "x")
		{
			// Start from the left margin and end at the right margin
			return reverse === true
				? [visual.width - visual.marginRight, visual.marginLeft]
				: [visual.marginLeft, visual.width - visual.marginRight];
		}
		else
		{
			// Start from the top margin and end at the bottom margin and also take
			// the height of the legend/swatches into account
			return reverse === true
				? [visual.height - visual.marginBottom, visual.marginTop + (visual.legend?.height ?? 0)]
				: [visual.marginTop + (visual.legend?.height ?? 0), visual.height - visual.marginBottom];
		}
	}

	/******************************************************************************
	* Creates an in-memory DOM with a basic scaffold document. Then builds the SVG
	* element, legend, and axes as needed, with the configured dimensions.
	*
	* @param {object} visual The visualization settings.
	* @param {function} colors A color interpolation function.
	* @param {function} x A x-axis scale function.
	* @param {function} y A y-axis scale function.
	* @returns {HTMLElement} The SVG element from the in-memory DOM which D3 can
	* manipulate.
	******************************************************************************/
	static constructSvg(visual, colors, x, y)
	{
		const DOM = new JSDOM(HTML_FRAGMENT);
		const bodyElement = DOM.window.document.querySelector("body");
		const svg = D3.select(bodyElement).append("svg")
			.attr("height", visual.height)
			.attr("width", visual.width)
			.attr("viewBox", visual.viewBox)
			.attr("style", `max-width: 100%; height: auto; font: ${visual.fontSize} ${visual.fontFamily}`);

		if (visual.legend?.type && colors != null)
			Legend.createLegend(svg, colors, visual);

		if (visual.axes)
			Axes.drawAxes(svg, visual, x, y);

		return svg;
	}

	/******************************************************************************
	* Gets the color scheme.
	*
	* @param {array} domain The color scale domain.
	* @param {object|string|Array} colorPalette The color palette, an array of
	* HTML color strings, or a single HTML color string.
	* @returns {function} A color interpolation function.
	******************************************************************************/
	static getColorPalette(domain, colorPalette)
	{
		const indexRegex = /\[(\d+)\]/;
		let colorRange;
		let index;

		if (!colorPalette)
			colorPalette = "interpolateSpectral";
		else if (typeof colorPalette === "string" && indexRegex.test(colorPalette))
		{
			index = parseInt(colorPalette.match(indexRegex)[1]);
			colorPalette = colorPalette.replace(indexRegex, "");
		}
		
		if (Array.isArray(colorPalette))
			colorRange = colorPalette;
		else if (typeof D3[colorPalette] === "function")
			colorRange = D3.quantize(t => D3[colorPalette](t * 0.8 + 0.1), domain.length);
		else if (Array.isArray(D3[colorPalette]))
		{
			if (index != null)
				colorRange = D3[colorPalette][index];
			else if (typeof D3[colorPalette][0] === "string")
				colorRange = D3[colorPalette];
			else
				colorRange = D3[colorPalette][D3[colorPalette].length - 1];
		} 
		else
			return D3.scaleOrdinal().range([colorPalette]);

		if (Array.isArray(domain) && domain.every(d => typeof d === "number"))
		{
			const minValue = D3.min(domain);
			const maxValue = D3.max(domain);
			const digitRemoval = Number.isInteger(maxValue) ? 1 : 2;
			const digits = Math.max(0, /(\d+)\.\d*/.exec(maxValue)[1].length - digitRemoval);
			const roundTo = Math.pow(10, digits);
			const lowerBound = Math.floor(minValue);
			const upperBound = Math.ceil(maxValue / roundTo) * roundTo;
			return D3.scaleQuantize()
				.domain([D3.min([0, lowerBound]), upperBound])
				.range(colorRange);
		}
		else
		{
			return D3.scaleOrdinal()
				.domain(domain)
				.range(colorRange);
		}
	}
};