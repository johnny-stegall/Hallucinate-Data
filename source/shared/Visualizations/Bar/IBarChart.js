import IVisualization from "../IVisualization.js";

const DEFAULTS = Object.freeze(
{
	axes:
	{
		x: { location: "Bottom" },
		y: { location: "Left" }
	},
	marginBottom: 30,
	marginLeft: 40
});

/******************************************************************************
* A contract to be implemented by all bar charts.
******************************************************************************/
export default class IBarChart extends IVisualization
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
		return "bar-chart.json";
	}

	/******************************************************************************
	* Applies default settings.
	*
	* @param {object} visual The visualization settings.
	* @param {object} [defaults] The default settings.
	* @returns {object} The visualization settings with defaults applied.
	******************************************************************************/
	static applyDefaults(visual, defaults = this.defaults)
	{
		return super.applyDefaults(visual, defaults);
	}
};