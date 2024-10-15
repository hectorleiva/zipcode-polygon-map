CREATE DATABASE zipcode_polygons;

\connect zipcode_polygons;

CREATE TABLE zipcode_polygons_table (
    zipcode varchar(5) PRIMARY KEY,
    geometric_polygons GEOMETRY
);

