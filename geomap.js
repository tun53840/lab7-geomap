// Lab 7: Geomaps
// Follow the lab instructions. Start with Activity 1.1: load ./topo.json with d3.json().
Promise.all([
   d3.json("./topo.json"), //load the TopoJSON data 
   d3.csv("./cities.csv"), //load the GPS coords for cities 
   d3.csv("./states.csv")  //load the state population for each state  
 ])
.then((data) => {
    
   // These values were chosen to fit the US into our SVG.
   // If your map is clipped or off-center, adjust scale and translate.

   const topology = data[0];
   const cities = data[1];
   const states = data[2];
    

    
 
    
    

    
    
   var projection = d3.geoAlbersUsa().scale(700).translate([487.5, 305])
    var path = d3.geoPath(projection)

    const topo = topojson.feature(topology, topology.objects.states)
   

   const stateDictionary = new Map();
   states.forEach((state) => {  // this is basically a for loop
     stateDictionary.set(state.State, +state["2018 Population"])
   })

   var blues = d3.scaleSequential()
                   .domain(d3.extent(Array.from(stateDictionary.values())))
                   .range(["white", "steelblue"]);
   const svg = d3.select("#geomap").append('g').attr('transform', 'translate(50,50)');

   const projected = cities
    .map((d) => ({ ...d, xy: projection([+d.longitude, +d.latitude]) }))
    .filter((d) => d.xy !== null);

  


   svg.append("g")
   .selectAll("path")
   .data(topo.features)
   
   .join("path")
     .attr("d", path)
     .attr("fill", (d) => {
        const pop = stateDictionary.get(d.properties.name);
        return pop !== undefined ? blues(pop) : "lightgray";
     })
     .attr("stroke", "black")
     .attr("stroke-width", "1px");

svg.append("g")
  .selectAll("circle")
  .data(projected)
  .join("circle")
    .attr("cx", (d) => d.xy[0])
    .attr("cy", (d) => d.xy[1])
    .attr("r", 4)
    .attr("fill", "red")
    .attr("stroke", "white");
    
    console.log(data); 
    console.log(topo.features[0].properties)
    
 })

