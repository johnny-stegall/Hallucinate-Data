import IBarChart from "../IBarChart.js";

const DEFAULTS = Object.freeze(
{
	seriesGroupProperty: "group",
	seriesLabelProperty: "key",
	seriesValueProperty: "value"
});

/******************************************************************************
* A contract to be implemented by charts with grouped data.
******************************************************************************/
export default class IGrouped extends IBarChart
{
	/******************************************************************************
	* Gets the defaults.
	*
	* @returns {object} The visualization defaults.
	******************************************************************************/
	static get defaults()
	{
		return { ...IBarChart.defaults, ...DEFAULTS };
	}

	/******************************************************************************
	* Gets the schema filename.
	*
	* @returns {string} The schema filename.
	******************************************************************************/
	static get schema()
	{
		return "grouped-bar-chart.json";
	}
};