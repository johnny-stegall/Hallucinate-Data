import BoxPlot from "../shared/Visualizations/BoxPlot.js";
import Choropleth from "../shared/Visualizations/Choropleth.js";
import CirclePack from "../shared/Visualizations/Hierarchical/CirclePack.js";
import ForceGraph from "../shared/Visualizations/ForceGraph.js";
import GroupedBarChart from "../shared/Visualizations/Bar/Grouped/GroupedBarChart.js";
import Histogram from "../shared/Visualizations/Histogram.js";
import HorizontalBarChart from "../shared/Visualizations/Bar/HorizontalBarChart.js";
import LineChart from "../shared/Visualizations/LineChart.js";
import PieChart from "../shared/Visualizations/PieChart.js";
import Scatterplot from "../shared/Visualizations/Scatterplot.js";
import StackedHorizontalBarChart from "../shared/Visualizations/Bar/Grouped/StackedHorizontalBarChart.js";
import StackedVerticalBarChart from "../shared/Visualizations/Bar/Grouped/StackedVerticalBarChart.js";
import Sunburst from "../shared/Visualizations/Hierarchical/Sunburst.js";
import Treemap from "../shared/Visualizations/Hierarchical/Treemap.js";
import VerticalBarChart from "../shared/Visualizations/Bar/VerticalBarChart.js";
import WordCloud from "../shared/Visualizations/WordCloud.js";
import IVisualization from "./Visualizations/IVisualization.js";

/******************************************************************************
* Factory for creating visualizations.
******************************************************************************/
export default class VisualizationFactory
{
	/****************************************************************************
	* Gets a visualization class.
	*
	* @param {string} visualization The visualization from the route parameter.
	* @returns {IVisualization} An instance of a specific implementation of
	* {@link IVisualization}.
	* @throws {Error} If the visualization isn't supported.
	****************************************************************************/
	static getVisualization(visualization)
	{

		switch (visualization.toLowerCase())
		{
			case "box-plot":
				return BoxPlot;
			case "choropleth":
				return Choropleth;
			case "circle-pack":
				return CirclePack;
			case "force-graph":
				return ForceGraph;
			case "grouped-bar-chart":
				return GroupedBarChart;
			case "histogram":
				return Histogram;
			case "horizontal-bar-chart":
				return HorizontalBarChart;
			case "line-chart":
				return LineChart;
			case "pie-chart":
				return PieChart;
			case "scatterplot":
				return Scatterplot;
			case "stacked-horizontal-bar-chart":
				return StackedHorizontalBarChart;
			case "stacked-vertical-bar-chart":
				return StackedVerticalBarChart;
			case "sunburst":
				return Sunburst;
			case "treemap":
				return Treemap;
			case "vertical-bar-chart":
				return VerticalBarChart;
			case "word-cloud":
				return WordCloud;
			default:
				throw new Error(`Visualization ${visualization} is not supported.`);
		}
	}
};