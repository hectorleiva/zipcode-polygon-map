const shapefile = require("shapefile");
const fs = require("fs");

const shapefilePath = "./census_data/tl_2023_us_zcta520.shp";
const dbfFilePath = "./census_data/tl_2023_us_zcta520.dbf";
const writeStream = fs.createWriteStream("output.geojson");

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

      return source.read().then(processFeature);
    }),
  )
  .catch((error) => console.error(error.stack));
