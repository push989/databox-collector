# databox-collector
Serves as an integration service between various data sources and Databox.

# Running the project locally
Get the secrets needed to run the project:
1. create a .env file in the root of the project and copy the values from .env.example
2. fill in the blank secret values (shared via private channels)

After your .env file is ready you can run the project either with npm:

    npm install
    npm run compile
    npm run start

Or spin up a docker container:

    docker compose up

The server will start on port 3000 by default.

NOTE: 
Development was done with node v18.12.1, from the root you can run:

    nvm use
