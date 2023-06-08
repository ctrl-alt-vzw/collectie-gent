# Collage van de gentenaar

A software collection used to create the installation for the "collectie van Gent" incentive. It consists of a number of tools to adapt existing images, a backend cluster used to serve the necessary pages, maintain the postgress database and serve the uploaded images.

## Installation

Make sure you have both docker and docker-compose installed. Use the `.env.template` to generate a `.env` file in the root folder before you start.
Use the following command to start the services in watch mode, when developing. 

```bash
docker-compose -f docker-compose.dev.yml
```
Use this command to start the services in deployment, for example when running in the cloud. Don't forget to adapt the `Caddyfile` in the root folder to the new URL you've chosen.
```bash
docker-compose -f docker-compose.deploy.ymla
```
The latter makes use of containers pushed to a hub, which means you'll have to create an account on the docker hub, fill in your own details in the `.env`. and push your own build. 
If you do not wish to do so, and want to run the project as is right now, you can use the following:
```

VERSION=latest
OWNER=crshlab

```

## Usage

There are a number of services, both front-end and back-end.
### Touch
This is the touch interface used on the touch display in the installation. The main application for selecting an object, cutting out a selection, and placing it in the collage.
### web
A simple static website used to serve the clippings, and serve more information regarding the selected items. 
### API
A rest-API where all the clippings, items, loggings etc are available. The root endpoint serves an overview of the available endpoints and the expected data
### filestore
This service is used to save the clippings in different resolutions, and to serve them back accordingly.
### Projection
The installation projected the collage onto the wall behind the display, this page uses a websocket served by the manager container to display changes in realtime. 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
