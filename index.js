const shapefile = require("shapefile");
const fs = require("fs");
const { pool } = require("./db");

const shapefilePath = "./census_data/tl_2023_us_zcta520.shp";
const dbfFilePath = "./census_data/tl_2023_us_zcta520.dbf";

const writeStream = fs.createWriteStream("output.geojson");
const writeJSONObjectsStream = fs.createWriteStream("output.json");

writeStream.write('{"type":"FeatureCollection","features":[');

let isFirstFeature = true;

const connectToDB = process.env.INSERT_TO_POSTGRES === "true";

function endRun() {
  writeStream.write("]}");
  writeStream.end();

  writeJSONObjectsStream.end();

  if (geometricData.length > 0) {
    console.log(`Inserting remaining ${geometricData.length} rows...`);
    bulkInsert(geometricData);
  }

  console.log("Run complete");
}

let geometricData = [];

async function bulkInsert(geometricJSONData) {
  const insertQuery = `INSERT INTO zipcode_polygons_table (zipcode, geometric_polygons) VALUES ($1, ST_GeomFromGEOJSON($2))`;

  const client = await pool.connect();

  try {
    console.log(`Inserting ${geometricJSONData.length} rows...`);

    await client.query("BEGIN");

    for (const { zipCode, geometry } of geometricJSONData) {
      await client.query(insertQuery, [zipCode, JSON.stringify(geometry)]);
    }

    await client.query("COMMIT");

    console.log(`Successfully inserted ${geometricJSONData.length} rows`);
  } catch (error) {
    console.error(`Error during bulk insert: `, error.stack);
    await client.query("ROLLBACK");
  } finally {
    console.log("Closing connection...");
    client.release();
  }
}

shapefile
  .open(shapefilePath, dbfFilePath)
  .then((source) =>
    source.read().then(async function processFeature(result) {
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

      const geometricJSONObject = {
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
      writeJSONObjectsStream.write(JSON.stringify(geometricJSONObject));

      if (connectToDB) geometricData.push(geometricJSONObject);

      if (geometricData.length === 10000 && connectToDB) {
        await bulkInsert(geometricData);
        console.log("Resetting geometricData array...");
        geometricData = [];
      }

      return source.read().then(processFeature);
    }),
  )
  .catch((error) => console.error(error.stack));
