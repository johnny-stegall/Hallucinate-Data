import * as D3 from "d3";

export default class Axes
{
	/******************************************************************************
	* Draws the x and y axes.
	*
	* @param {HTMLElement} svg The SVG container element.
	* @param {object} visual The visualization settings.
	* @param {function} x The x scale.
	* @param {function} y The y scale.
	******************************************************************************/
	static drawAxes(svg, visual, x, y)
	{
		// Append the x axis
		if (visual.axes.x.ticks > 0)
		{
			const xAxisTop = visual.axes.x.location === "Top"
				? visual.marginTop + (visual.legend?.height ?? 0)
				: visual.height - visual.marginBottom;

			svg.append("g")
				.attr("transform", `translate(0,${xAxisTop})`)
				.call(D3[`axis${visual.axes.x.location}`](x).ticks(visual.axes.x.ticks, visual.axes.x.tickFormat))
				.call(g => { if (visual.axes.x.domainLine != true) g.select(".domain").remove() })
				.call(g => g.append("text")
					.attr("fill", "currentColor")
					.attr("text-anchor", "start")
					.text(visual.axes.x.label)
					.attr("x", (data, index, element) => visual.width - (element[0].getBoundingClientRect().width || visual.axes.x.label?.length * 6))
					.attr("y", visual.axes.x.location === "Top" ? 0 : "2.75em")
			);
		}

		// Append the y axis
		if (visual.axes.y.ticks > 0)
		{
			const yAxisLeft = visual.axes.y.location === "Left"
				? visual.marginLeft
				: visual.width - visual.marginRight;

			svg.append("g")
				.attr("transform", `translate(${yAxisLeft},0)`)
				.call(D3[`axis${visual.axes.y.location}`](y).ticks(visual.axes.y.ticks, visual.axes.y.tickFormat))
				.call(g => { if (visual.axes.y.domainLine != true) g.select(".domain").remove() })
				.call(g => g.append("text")
					.attr("fill", "currentColor")
					.attr("text-anchor", visual.axes.y.location === "Left" ? "start" : "end")
					.text(visual.axes.y.label)
					.attr("x", (data, index, element) => visual.axes.y.location === "Left" ? -20 : visual.width - (element[0].getBoundingClientRect().width || visual.axes.y.label?.length * 6))
					.attr("y", visual.marginTop)
				);
		}
	}
};