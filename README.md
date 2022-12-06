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


# Overview

## IntegratorService

The main entry point for triggering the integration process is the /services/IntegratorService.integrate(options) method.

An "options" object can be provided to select which datasources and metrics need to be sent to databox:

    [
        {
            "dataSource": "StackOverflow",
            "metrics": [
                "TypescriptQuestionCount",
                "PhpQuestionCount"
            ]
        },
        {
            "dataSource": "Reddit"
        }
    ]

If the "metrics" array is not provided all of the datasource's metrics will be integrated.

The IntegratorService gets data for all requested metrics via the CollectorService and pushes successfully retrieved metrics to Databox. It returns a response of successfully pushed and erroneous metrics (error either when getting the data from an external source or when pushing to databox).

## CollectorService

The "CollectorService" is responsible for retrieving metric data from external services. It does so by getting a MetricRetriever for each of the requested metrics. A MetricRetriever is a class that implements the following interface:

    interface MetricRetriever {
      getData(metric: MetricName): Promise<MetricData>;
    }

Examples of metric retrievers are "QuestionCountRetriever" and "SubredditPostCountRetriever". 

Adding a new MetricRetriever is pretty straightforward - add a class that implements MetricRetriever and register it in the "dataSourceRetrievers" configuration object, inside of CollectorModels. The fetching of data, error handling and pushing to Databox is then streamlined and should work without further changes.

## Periodic triggering

Periodic integration triggering is implemented in the "processors" folder via the "cron" npm package. You can set a desired crontab and a implement a job that should execute based on that crontab. If the project is started with an env value of PROCESSOR=true, a cronjob will run every minute to integrate all the metrics to Databox.
You can run two separate processes, one with SERVER=true and the other with PROCESSOR=true to separate the express server from the periodic job processor. For local development both values are set to true so that the server and processor run in the same process.

## Logging

Currently logs are saved both to the console and a <root>/log file via pinojs. Logs in the file are in an NDJSON format and can be obtained by a stream from GET /integraton/logs endpoint.

# Possible improvements

- Integrate with a proper message queue system (BullMQ for example) to be able to share the jobs between several processor instances with job distribution, failure handling etc. - allows for better scaling
- Use elasticsearch to store logs
- Add a request retry mechanism for http errors in case a service is temporarily down
- If the expected traffic is high, consider adding a local database to store the retrieved metrics and push them to Databox periodically in chunks.
