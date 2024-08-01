import * as D3 from "d3";

/******************************************************************************
* Draws a legend or swatches.
******************************************************************************/
export default class Legend
{
	/******************************************************************************
	* Creates a legend.
	*
	* @param {HTMLOrSVGElement} svg The visualization SVG element.
	* @param {function} colors The D3 coloring function.
	* @param {object} visual The visualization settings.
	* @returns {function} A color interpolation function.
	******************************************************************************/
	static createLegend(svg, colors, visual)
	{
		if (visual?.legend?.type === "Swatches")
		{
			const swatchesHtml = this.#drawSwatches(svg, colors, visual);
			svg
				.attr("height", visual.height + 100)
				.insert("foreignObject", ":first-child")
					.html(swatchesHtml);
		}
		else if (visual?.legend?.type === "Legend")
		{
			this.#drawLegend(svg, colors, visual);
			svg.attr("height", visual.height + visual.legend.height);
		}
	}

	/******************************************************************************
	* Draws a color ramp.
	*
	* @param {HTMLOrSVGElement} rootSvg The visualization SVG element.
	* @param {function} colors The D3 coloring function.
	* @param {number} [steps=256] The number of steps for the gradient.
	******************************************************************************/
	static #drawColorRamp(rootSvg, colors, steps = 256)
	{
    const svg = rootSvg.append("svg")
			.attr("viewBox", [0, 0, steps, 1])
			.attr("preserveAspectRatio", "none");

    for (let stepIndex = 0; stepIndex < steps; stepIndex++)
		{
			// Overlapping the rectangles creates a smoother gradient
      svg.append("rect")
        .attr("width", 2)
        .attr("height", 1)
        .attr("x", stepIndex) 
        .attr("fill", colors(stepIndex / (steps - 1)))
    }
  }

	/******************************************************************************
	* Draws a legend.
	*
	* @param {HTMLOrSVGElement} rootSvg The visualization SVG element.
	* @param {function} colors The D3 coloring function.
	* @param {object} visual The visualization settings.
	******************************************************************************/
	static #drawLegend(rootSvg, colors, visual)
	{
		const unknown = visual.legend.formatUnknown == null ? undefined : colors.unknown();
		const unknowns = unknown == null || unknown === D3.scaleImplicit ? [] : [unknown];
		const viewBoxLeft = parseInt(rootSvg.attr("viewBox")?.split(",")[0] ?? 0);
		const viewBoxTop = parseInt(rootSvg.attr("viewBox")?.split(",")[1] ?? 0);
		const svg = rootSvg.insert("svg", ":first-child")
			.attr("width", visual.legend.width)
			.attr("height", visual.legend.height)
			.attr("x", visual.marginLeft + viewBoxLeft)
			.attr("y", visual.marginTop + viewBoxTop)
			.style("overflow", "visible")
			.style("display", "block");

		let tickAdjust = g => g.selectAll(".tick line")
			.attr("y1", visual.legend.marginTop + visual.legend.marginBottom - visual.legend.height);
		let x;

		if (colors.interpolate)
		{
			// Continuous
			const colorCount = Math.min(colors.domain().length, colors.range().length);

			x = colors
				.copy()
				.rangeRound(D3.quantize(D3.interpolate(visual.legend.marginLeft, visual.legend.width - visual.legend.marginRight), colorCount));

			svg.append("svg")
				.attr("x", visual.legend.marginLeft)
				.attr("y", visual.legend.marginTop)
				.attr("width", visual.legend.width - visual.legend.marginLeft - visual.legend.marginRight)
				.attr("height", visual.legend.height - visual.legend.marginTop - visual.legend.marginBottom)
				.attr("preserveAspectRatio", "none")
				.append("g")
					.append(() => this.#drawColorRamp(colors.copy().domain(D3.quantize(D3.interpolate(0, 1), colorCount))));
		}
		else if (colors.interpolator)
		{
			// Sequential
			x = Object.assign(colors.copy()
				.interpolator(D3.interpolateRound(visual.legend.marginLeft, visual.legend.width - visual.legend.marginRight)),
				{range() { return [visual.legend.marginLeft, visual.legend.width - visual.legend.marginRight]; }});

			svg.append("svg")
				.attr("x", visual.legend.marginLeft)
				.attr("y", visual.legend.marginTop)
				.attr("width", visual.legend.width - visual.legend.marginLeft - visual.legend.marginRight)
				.attr("height", visual.legend.height - visual.legend.marginTop - visual.legend.marginBottom)
				.attr("preserveAspectRatio", "none")
				.append("g")
					.append(() => this.#drawColorRamp(colors.interpolator()));

			// scaleSequentialQuantile doesn't implement ticks or tickFormat
			if (!x.ticks)
			{
				if (visual.legend.tickValues === undefined)
				{
					const n = Math.round(visual.legend.ticks + 1);
					visual.legend.tickValues = D3.range(n).map(i => D3.quantile(colors.domain(), i / (n - 1)));
				}

				if (typeof visual.legend.tickFormat !== "function")
					visual.legend.tickFormat = D3.format(visual.legend.tickFormat === undefined ? ",f" : visual.legend.tickFormat);
			}
		}
		else if (colors.invertExtent)
		{
			// Threshold
			const thresholds = (colors.thresholds
				? colors.thresholds() // scaleQuantize
				: colors.quantiles
					? colors.quantiles() // scaleQuantile
					: colors.domain()).concat(unknowns); // scaleThreshold

			const thresholdFormat = visual.legend.tickFormat != null
				? D3.format(visual.legend.tickFormat)
				: thresholds.every(value => value > 1 || value < -1)
					? D3.format("d")
					: D3.format(".1f");

			x = D3.scaleLinear()
				.domain([-1, colors.range().length - 1])
				.rangeRound([visual.legend.marginLeft, visual.legend.width - visual.legend.marginRight]);

			svg.append("g")
				.selectAll("rect")
				.data(colors.range())
				.join("rect")
					.attr("x", (d, i) => x(i - 1))
					.attr("y", visual.legend.marginTop)
					.attr("width", (d, i) => x(i) - x(i - 1))
					.attr("height", visual.legend.height - visual.legend.marginTop - visual.legend.marginBottom)
					.attr("fill", d => d);

			visual.legend.tickValues = D3.range(thresholds.length);
			visual.legend.tickFormat = i => thresholdFormat(thresholds[i], i);
		}
		else
		{
			// Ordinal
			const domain = visual.legend.tickValues
				?? (colors.domain().length > 0
					? colors.domain().concat(unknowns)
					: colors.range());
			x = D3.scaleBand()
				.domain(domain)
				.rangeRound([visual.legend.marginLeft, visual.legend.width - visual.legend.marginRight]);

			svg.append("g")
				.selectAll("rect")
				.data(domain)
				.join("rect")
					.attr("x", x)
					.attr("y", visual.legend.marginTop)
					.attr("width", Math.max(0, x.bandwidth() - 1))
					.attr("height", visual.legend.height - visual.legend.marginTop - visual.legend.marginBottom)
					.attr("fill", colors);

			tickAdjust = () => {};
		}

		svg.append("g")
			.attr("transform", `translate(0,${visual.legend.height - visual.legend.marginBottom})`)
			.call(D3.axisBottom(x)
				.ticks(visual.legend.ticks)
				.tickFormat(typeof visual.legend.tickFormat === "function"
					? visual.legend.tickFormat
					: typeof visual.legend.tickFormat === "string"
						? visual.legend.tickFormat
						: undefined)
				.tickSize(visual.legend.tickSize)
				.tickValues(visual.legend.tickValues)
			)
			.call(tickAdjust)
			.call(g => g.select(".domain").remove())
			.call(g => g.append("text")
				.attr("x", visual.legend.marginLeft)
				.attr("y", visual.legend.marginTop + visual.legend.marginBottom - visual.legend.height - visual.legend.tickSize)
				.attr("fill", "currentColor")
				.attr("text-anchor", "start")
				.attr("font-weight", "bold")
				.attr("class", "title")
				.text(visual.legend.title));
	}

	/******************************************************************************
	* Draws color swatches.
	*
	* @param {HTMLOrSVGElement} rootSvg The visualization SVG element.
	* @param {function} colors The D3 coloring function.
	* @param {object} visual The visualization settings.
	* @returns {string} HTML containing the color swatches.
	******************************************************************************/
	static #drawSwatches(rootSvg, colors, visual)
	{
		const id = "swatches";
		const unknown = visual.legend.formatUnknown == null ? undefined : colors.unknown();
		const unknowns = unknown == null || unknown === D3.scaleImplicit ? [] : [unknown];
		const domain = colors.domain().length > 0
			? colors.domain().concat(unknowns)
			: colors.range();
		const viewBoxLeft = parseInt(rootSvg.attr("viewBox")?.split(",")[0] ?? 0);
		const viewBoxTop = parseInt(rootSvg.attr("viewBox")?.split(",")[1] ?? 0);
		const left = visual.marginLeft + viewBoxLeft;
		const top = visual.marginTop + viewBoxTop;

		if (visual.legend.format === undefined)
			visual.legend.format = x => x === unknown ? visual.legend.formatUnknown : x;
		
		if (visual.legend.columnWidth != null)
			return `
	<div style="display: flex; align-items: center; margin-left: ${+visual.legend.marginLeft}px; min-height: 33px; font: 10px sans-serif; top: ${top}; left: ${left};">
		<style>
		.${id}-item
		{
			break-inside: avoid;
			display: flex;
			align-items: center;
			padding-bottom: 1px;
		}

		.${id}-label
		{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: calc(100% - ${+visual.legend.swatchWidth}px - 0.5em);
		}

		.${id}-swatch
		{
			width: ${+visual.legend.swatchWidth}px;
			height: ${+visual.legend.swatchHeight}px;
			margin: 0 0.5em 0 0;
		}
		</style>
		<div style="width: ${visual.legend.columnWidth}">
		${domain.map(value =>
		{
			const label = `${visual.legend.format(value)}`;
			return `
			<div class="${id}-item">
				<div class="${id}-swatch" style="background: ${colors(value)}"></div>
				<div class="${id}-label" title="${label}">${label}</div>
			</div>`;
		})}
		</div>
	</div>`.replace(/[\n\t]/g, "");
		else
			return `
	<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+visual.legend.marginLeft}px; font: 10px sans-serif; top: ${top}; left: ${left};">
		<style>
		.${id}
		{
			display: inline-flex;
			align-items: center;
			margin-right: 1em;
		}

		.${id}::before
		{
			content: "";
			width: ${+visual.legend.swatchWidth}px;
			height: ${+visual.legend.swatchHeight}px;
			margin-right: 0.5em;
		}
		</style>
		<div>
		${domain.map(value => `<span class="${id}" style="color: ${colors(value)}">${visual.legend.format(value)}</span>`)}
		</div>
	</div>`.replace(/[\n\t]/g, "");
	}
};