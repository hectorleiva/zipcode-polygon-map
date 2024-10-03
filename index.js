const shapefile = require("shapefile");
const fs = require("fs");

const shapefilePath = "./census_data/tl_2023_us_zcta520.shp";
const dbfFilePath = "./census_data/tl_2023_us_zcta520.dbf";
const writeStream = fs.createWriteStream("output-limited.geojson");

writeStream.write('{"type":"FeatureCollection","features":[');

let isFirstFeature = true;

function endRun() {
  writeStream.write("]}");
  writeStream.end();
  console.log("Run complete");
}

shapefile
  .open(shapefilePath, dbfFilePath)
  .then((source) =>
    source.read().then(function processFeature(result) {
      if (result.done) {
        endRun();
        return;
      }

      // result.value contains the feature data with properties and geometry
      const { properties, geometry } = result.value;

      console.log(properties, geometry.type, JSON.stringify(geometry));

      const geojosnFeature = {
        type: "FeatureCollection",
        properties: {
          zipCode: properties.ZCTA5CE20,
        },
        geometry,
      };

      if (!isFirstFeature) {
        writeStream.write(",");
      } else {
        isFirstFeature = false;
      }

      writeStream.write(JSON.stringify(geojosnFeature));

      return source.read().then(endRun);
    }),
  )
  .catch((error) => console.error(error.stack));
