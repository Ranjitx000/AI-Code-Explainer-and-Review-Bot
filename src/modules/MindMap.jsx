// src/modules/MindMap.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const drawChart = (svg, data, width, height) => {
    if (!data || width === 0 || height === 0) return;

    svg.html(''); // Clear previous render

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width - 200]);
    treeLayout(root);

    const g = svg.append('g').attr('transform', 'translate(100,0)');

    g.selectAll('path.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(192, 132, 252, 0.5)')
        .attr('stroke-width', 1.5);

    const node = g.selectAll('g.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
        .attr('r', 5)
        .attr('fill', '#a78bfa');

    node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -12 : 12)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .attr('fill', 'white')
        .attr('font-size', '12px');
};

const MindMap = ({ data }) => {
    const svgRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!data || !container) return;

        const svg = d3.select(svgRef.current);

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            svg.attr('width', width).attr('height', height);
            drawChart(svg, data, width, height);
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [data]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default MindMap;