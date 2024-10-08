CREATE DATABASE zipcode_polygons;

\connect zipcode_polygons;

CREATE TABLE zipcode_polygons_table (
    zipcode NUMERIC,
    geometric_polygons GEOMETRY
);

