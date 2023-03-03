
-- SELECT annotation, COUNT(annotation) AS CountOf FROM annotations GROUP BY annotation ORDER BY COUNT(annotation) DESC LIMIT 100

-- UPDATE annotations SET annotation=N'' WHERE annotation IS NULL
-- SELECT * FROM annotations ORDER BY RANDOM() LIMIT 50

-- UPDATE annotations SET flagged=false WHERE id=1932

-- SELECT setval('clippings_id_seq', (SELECT max(id) FROM clippings));


-- select sequence_schema, sequence_name
-- from information_schema.sequences;

-- SELECT collection, COUNT(collection) AS CountOf FROM annotations GROUP BY collection ORDER BY COUNT(collection) DESC LIMIT 100

-- SELECT * FROM annotations WHERE collection='cogent'

--  UPDATE annotations SET hidden=true WHERE "gentImageURI" LIKE '%.mp4'

-- SELECT * FROM annotations WHERE metadata IS NULL

-- SELECT * FROM annotations WHERE colordata IS NULL

-- SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI", annotations.metadata, annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID" ORDER BY ABS(vertex.x - 22.217726) + ABS(vertex.y - -23.960232) + ABS(vertex.z - 17.239613) LIMIT 10 
-- SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI", annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID"  ORDER BY vertex.id
-- SELECT * FROM annotations WHERE colordata IS NULL;
-- SELECT annotation FROM annotations WHERE annotation IS NOT NULL;
-- SELECT * FROM vertex WHERE "annotationUUID" = '82905e9d-67f2-4732-8623-85ebaedf4ddd'
 