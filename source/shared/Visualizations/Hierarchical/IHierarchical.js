import IVisualization from "../IVisualization.js";

const DEFAULTS = Object.freeze(
{
	childrenProperty: "children"
});

/******************************************************************************
* A contract to be implemented by hierarchical charts.
******************************************************************************/
export default class IHierarchical extends IVisualization
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
		return "hierarchical.json";
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