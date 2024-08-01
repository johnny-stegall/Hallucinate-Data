import * as D3 from "d3";
import IHierarchical from "./IHierarchical.js";

/******************************************************************************
* A circle pack chart.
******************************************************************************/
export default class CirclePack extends IHierarchical
{
	/****************************************************************************
	* Draws a circle pack chart.
	*
	* @param {object[]} data The data to visualize.
	* @param {object} visual The visualization settings.
	* @returns {string} The visualization as SVG.
	****************************************************************************/
	static draw(data, visual)
	{
		visual = super.applyDefaults(visual);

		// Specify the number format for values
		const format = D3.format(",d");
	
		// Create the pack layout
		const pack = D3.pack()
			.size([visual.width - visual.marginLeft - visual.marginRight, visual.height - visual.marginBottom - visual.marginTop - (visual.legend?.height ?? 0)])
			.padding(3);
	
		// Compute the hierarchy from the data; recursively sum the values for each
		// node; sort the tree by descending value; lastly apply the pack layout
		const root = pack(D3.hierarchy(data, d => d[visual.childrenProperty])
			.sum(d => d[visual.valueProperty])
			.sort((a, b) => b.value - a.value)
		);
	
		// Create the color palette
		const mustTraverse = [];
		const categories = new Set();
		mustTraverse.push(root);

		while (mustTraverse.length > 0)
		{
			const node = mustTraverse.pop();

			if (node.children)
			{
				categories.add(node.data[visual.labelProperty]);

				for (const child of node.children)
					mustTraverse.push(child);
			}
		}
		
		const colors = this.getColorPalette(categories, visual.colorPalette);

		// Create the SVG container
		const svg = this.constructSvg(visual, colors)
			.attr("text-anchor", "middle");

		// Place each node according to the layout’s x and y values
		const node = svg.append("g")
			.selectAll()
			.data(root.descendants())
			.join("g")
				.attr("transform", d => `translate(${d.x},${d.y + visual.marginTop + (visual.legend?.height ?? 0)})`);
	
		// Add a title
		node.append("title")
			.text(d => `${d.ancestors().map(d => d.data[visual.labelProperty]).reverse().join("/")}\n${format(d.value)}`);
	
		// Add a filled or stroked circle
		node.append("circle")
			.attr("fill", d => colors(d.data[visual.labelProperty]))
			.attr("stroke", d => d.children ? "#bbb" : null)
			.attr("r", d => d.r);
		
		// Add a label to leaf nodes
		const text = node
			.filter(d => !d.children && d.r > 10)
			.append("text")
				.attr("clip-path", d => `circle(${d.r})`);

		text.selectAll()
			.data(d => d.data[visual.labelProperty].split(" "))
			.join("tspan")
				.attr("x", 0)
				.attr("y", (data, index, nodes) => `${index - nodes.length / 2 + 0.35}em`)
				.text(d => d);
	
		// Add a tspan for the node’s value
		text.append("tspan")
			.attr("x", 0)
			.attr("y", d => `${d.data[visual.labelProperty].split(" ").length / 2 + 0.35}em`)
			.attr("fill-opacity", 0.7)
			.text(d => format(d.value));

		return svg.node().outerHTML;
	}
};