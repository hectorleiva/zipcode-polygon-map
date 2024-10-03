# Zipcode Polygon Map Project

We are going to create a zipcode polygon map using the data from the US Census Bureau. The data is available in the form of a shapefile. We will use the `geopandas` library to read the shapefile and plot the polygons on a map.

## Steps

1. Read the shapefile using the `geopandas` library.
2. Plot the polygons on a map.
3. Customize the map by adding within the polygon shapes the label of the zip code that it represents.

## Data

The data is available in the form of a shapefile. You can download the shapefile from the US Census Bureau website. The shapefile contains the polygons for each zip code in the United States.

Current location: https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2023&layergroup=ZIP+Code+Tabulation+Areas
Current size: 503.8 MB (Oct 2, 2024) (zipped)

Unzip the data into the `census_data/` directory

## Formatting the data

Ensure that the files that are defined in the `index.js` are adjusted for the files that are output in the `census_data/` directory.

Running `node index.js` should now generate a `output.geojson` file that contains all of the Census Zip data converted into a Geojson format.

## Extracting the data

Using `jq`, you can specify a zipcode to return back only the geometry of the zip code.

```
jq '.features[] | select(.properties.zipCode == "22031") | .geometry' output.geojson`
```

## Visualizing the data

Under the `site/index.js` file, the `customCoordinates` should now be filled in by the `geometry` data that was parsed from the earlier step.

Example of the data being visualized can be found here: https://jsfiddle.net/mcry9o1z/31/
