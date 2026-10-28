
d3.csv("./data/ARE_Spot_Prices.csv", d3.autoType)
    .then(function(data) {
        console.log("CSV loaded successfully!");
        console.table(data);

        const data2024 = data.find(d => d.Year === 2024);
        console.log("Data for 2024:", data2024);
        const barData = [
            {
                state: "Queensland",
                price: data2024["Queensland ($ per megawatt hour)"]
            },
            {
                state: "NSW",
                price: data2024["New South Wales ($ per megawatt hour)"]
            },
            {
                state: "Victoria",
                price: data2024["Victoria ($ per megawatt hour)"]
            },
            {
                state: "South Australia",
                price: data2024["South Australia ($ per megawatt hour)"]
            }
        ];
        console.table(barData);
        drawBarChart(barData);
    })
    .catch(function(error) {
        console.error("Error loading CSV:", error);
    });

function drawBarChart(data) {
    const margin = {
        top: 40,
        right: 30,
        bottom: 50,
        left: 60
    };

    const width = 800;
    const height = 450;

    const innerWidth =
        width - margin.left - margin.right;
    const innerHeight =
        height - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );
    
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, innerWidth])
        .padding(0.2);
        
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([innerHeight, 0])
        .nice();

    const xAxis = d3.axisBottom(xScale);
    innerChart.append("g")
        .attr("class", "x-axis")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    innerChart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.append("text")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text("Australian States");

    svg.append("text")
        .attr("x", -(margin.top + innerHeight / 2))
        .attr("y", 18)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Electricity Spot Price ($/MWh)");

    console.log("X Domain:", xScale.domain());
    console.log("X Range:", xScale.range());
    console.log("Y Domain:", yScale.domain());
    console.log("Y Range:", yScale.range());
    console.log("Queensland X:", xScale("Queensland"));
    console.log("NSW Y:", yScale(155));
    console.log("Bar Width:", xScale.bandwidth());
    console.log("Zero:", yScale(0));
    console.log("Fifty:", yScale(50));
    console.log("Hundred:", yScale(100));
    console.log("Maximum:", yScale(160));

    innerChart.append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "#e0f2fe")
        .attr("stroke", "#0284c7");

    console.log("Inner Width:", innerWidth);
    console.log("Inner Height:", innerHeight);

    innerChart.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.state))
        .attr("y", d => yScale(d.price))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.price))
        .attr("fill", "#2E8B57");

}

