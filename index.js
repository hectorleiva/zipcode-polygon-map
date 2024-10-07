const shapefile = require("shapefile");
const fs = require("fs");

const shapefilePath = "./census_data/tl_2023_us_zcta520.shp";
const dbfFilePath = "./census_data/tl_2023_us_zcta520.dbf";

const writeStream = fs.createWriteStream("output.geojson");
const writeJSONObjectsStream = fs.createWriteStream("output.json");

writeStream.write('{"type":"FeatureCollection","features":[');

let isFirstFeature = true;

function endRun() {
  writeStream.write("]}");
  writeStream.end();

  writeJSONObjectsStream.end();

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

      const geojsonFeature = {
        type: "FeatureCollection",
        properties: {
          zipCode: properties.ZCTA5CE20,
        },
        geometry,
      };

      const jsonObject = {
        zipCode: properties.ZCTA5CE20,
        geometry,
      };

      if (!isFirstFeature) {
        writeStream.write(",");
        writeJSONObjectsStream.write("\n");
      } else {
        isFirstFeature = false;
      }

      writeStream.write(JSON.stringify(geojsonFeature));
      writeJSONObjectsStream.write(JSON.stringify(jsonObject));

      return source.read().then(processFeature);
    }),
  )
  .catch((error) => console.error(error.stack));
