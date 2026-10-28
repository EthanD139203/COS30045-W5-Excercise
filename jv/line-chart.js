
d3.csv("./data/ARE_Spot_Prices.csv", d3.autoType)
    .then(function(data) {
        console.log("Exercise 5.2: CSV loaded!");
        console.table(data);
        
        const lineData = data.map(d => ({
            year: d.Year,
            price: d["Average Price (notTas-Snowy)"]
        }));

        console.log("Prepared line chart data:");
        console.table(lineData);
        lineData.sort((a, b) => a.year - b.year);
        console.log("Sorted line chart data:");
        console.table(lineData);

        console.log("Total records:", lineData.length);
        console.log("First record:", lineData[0]);
        console.log("Last record:", lineData[lineData.length - 1]);

        const invalidRows = lineData.filter(d =>
            !Number.isFinite(d.year) ||
            !Number.isFinite(d.price)
        );

        console.log("Total records:", lineData.length);
        console.log("First record:", lineData[0]);
        console.log(
            "Last record:",
            lineData[lineData.length - 1]
        );

        const invalidData = lineData.filter(d =>
            !Number.isFinite(d.year) ||
            !Number.isFinite(d.price)
        );

    console.log("Invalid records:", invalidData);
            console.log("Invalid records:", invalidRows);
            drawLineChart(lineData);
        })
        .catch(function(error) {
            console.error("Error loading CSV:", error);
        });

    function drawLineChart(data) {

    const margin = {
        top: 40,
        right: 60,
        bottom: 60,
        left: 70
    };

    const width = 900;
    const height = 450;

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;
        
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );
        
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([innerHeight, 0])
        .nice();

        const xAxis = d3.axisBottom(xScale)
            .ticks(7)
            .tickFormat(d3.format("d"));
    
        innerChart.append("g")
            .attr("class", "x-axis")
            .attr(
                "transform",
                `translate(0, ${innerHeight})`
            )
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale)
            .ticks(6)
            .tickFormat(d => `$${d3.format(",.0f")(d)}`);
        
        innerChart.append("g")
            .attr("class", "y-axis")
            .call(yAxis);
        
        svg.append("text")
            .attr("x", margin.left + innerWidth / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("x", -(margin.top + innerHeight / 2))
            .attr("y", 18)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Average Electricity Spot Price (AUD/MWh)");
            
        innerChart.selectAll(".data-point")
            .data(data)
            .join("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.price))
            .attr("r", 4)
            .attr("fill", "#75485E");    
        
        const lineGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.price))
            .curve(d3.curveLinear);
            
        innerChart.append("path")
            .attr("class", "price-line")
            .attr("d", lineGenerator(data))
            .attr("fill", "none")
            .attr("stroke", "#75485E")
            .attr("stroke-width", 2);

        innerChart.select(".price-line").lower();
}

