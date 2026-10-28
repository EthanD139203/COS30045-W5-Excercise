
d3.csv("./data/ARE_Spot_Prices.csv", d3.autoType)
    .then(function(data) {
        console.log("Exercise 5.3: CSV loaded!");
        console.table(data);

    const data2024 = data.find(d => d.Year === 2024);
    console.log("2024 record:", data2024);

    const donutData = [
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

    console.table(donutData);
    const totalPrice = d3.sum(donutData, d => d.price);
    console.log("Sum of selected prices:", totalPrice);

    donutData.forEach(d => {
        d.percentage = (d.price / totalPrice) * 100;
    });

    console.table(donutData);

    console.log("Number of states:", donutData.length);
    console.log("Total:", totalPrice);

    const invalidData = donutData.filter(d =>
        !Number.isFinite(d.price) || d.price < 0
    );

    console.log("Invalid records:", invalidData);

    drawDonutChart(donutData);
        })
        .catch(function(error) {
            console.error("Error loading CSV:", error);
        });
        
    function drawDonutChart(data) {

    const width = 400;
    const height = 400;

    const centerX = width / 2;
    const centerY = height / 2;

    console.log("Center X:", centerX);
    console.log("Center Y:", centerY);

    const svg = d3.select("#donut-chart")
        .selectAll("svg")
        .data([null])
        .join("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const donutGroup = svg.append("g")
        .attr(
            "transform",
            `translate(${centerX}, ${centerY})`
        );

        const pieGenerator = d3.pie()
            .value(d => d.price)
            .sort(null);

        const annotatedData = pieGenerator(data);

        const arcGenerator = d3.arc()
            .innerRadius(80)
            .outerRadius(150)
            .padAngle(0.02)
            .cornerRadius(5);

    const stateColors = [
        { state: "Queensland", color: "#76B6C2" },
        { state: "NSW", color: "#4CDDF7" },
        { state: "Victoria", color: "#ED7864" },
        { state: "South Australia", color: "#2F8999" }
    ];

    const colorScale = d3.scaleOrdinal()
        .domain(stateColors.map(d => d.state))
        .range(stateColors.map(d => d.color));

        donutGroup.selectAll(".donut-slice")
            .data(annotatedData)
            .join("path")
            .attr("class", "donut-slice")
            .attr("d", arcGenerator)
            .attr("fill", d => colorScale(d.data.state));

        annotatedData.forEach(d => {
            d.percentage =
                (d.endAngle - d.startAngle) / (2 * Math.PI);
        });
        console.table(
            annotatedData.map(d => ({
                state: d.data.state,
                percentage: d3.format(".1%")(d.percentage)
            }))
        );

        donutGroup.selectAll(".slice-label")
            .data(annotatedData)
            .join("text")
            .attr("class", "slice-label")
            .attr("transform", d =>
                `translate(${arcGenerator.centroid(d)})`
            )
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", d =>
                d.data.state === "NSW" ? "#17313A" : "#FFFFFF"
            )        
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text(d => d3.format(".1%")(d.percentage));

        donutGroup.append("text")
            .attr("class", "donut-center-label")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "28px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .text("2024");

        const legend = d3.select("#donut-legend");
        legend.selectAll(".legend-item")
            .data(data)
            .join("div")
            .attr("class", "legend-item")
            .html(d => `
                <span class="legend-color"
                    style="background-color: ${colorScale(d.state)}">
                </span>
                <span>${d.state}</span>
                <span>${d.price} AUD/MWh</span>
            `);

        console.log("Pie annotated data:");
        console.table(annotatedData);

        annotatedData.forEach(d => {
            console.log(
                d.data.state,
                "Start:", d.startAngle.toFixed(3),
                "End:", d.endAngle.toFixed(3),
                "Angle:", (d.endAngle - d.startAngle).toFixed(3)
            );
        });

        const totalAngle = d3.sum(
            annotatedData,
            d => d.endAngle - d.startAngle
        );

        console.log("Total angle:", totalAngle);
        console.log("Expected:", 2 * Math.PI);
}
