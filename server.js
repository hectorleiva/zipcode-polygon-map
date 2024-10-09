const http = require("http"),
  url = require("url"),
  fs = require("fs"),
  dotenv = require("dotenv").config(); // loads the .env file into process.env

const { pool } = require("./db");

http
  .createServer(async (req, res) => {
    if (req.url === "/") {
      fs.readFile("./site/index.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/html" });
          return res.end("404 Not Found");
        }

        const htmlWithStringReplacement = data.replace(
          "GOOGLE_MAPS_API_KEY",
          process.env.GOOGLE_MAPS_API_KEY,
        );

        res.writeHead(200, { "Content-Type": "text/html" });

        res.write(htmlWithStringReplacement);

        return res.end();
      });
    } else {
      const query = url.parse(req.url, true).query;
      res.writeHead(200, { "Content-Type": "application/json" });

      const zipcodes = query?.zipcodes?.split(",");

      const result = await pool.query(
        "SELECT zipcode, ST_AsGeoJSON(geometric_polygons) as polygons FROM zipcode_polygons_table WHERE zipcode = ANY($1)",
        [zipcodes || [22031]],
      );

      const geoJson = {
        type: "FeatureCollection",
        features: result.rows.map((row) => ({
          type: "Feature",
          geometry: JSON.parse(row.polygons),
          properties: {
            zipcode: row.zipcode,
          },
        })),
      };

      return res.end(JSON.stringify(geoJson));
    }
  })
  .listen(8000);

console.log("Server running at http://localhost:8000/");
