# TSH QA Engineer Recruitment task

## Before you start

Test is based on Playwright v1.25.2. You can find the full playwright documentation [here](https://playwright.dev/docs/intro). To build the project you will need [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Commands

In the project directory, you can run:
```
 npm init
 ```

Installs a package and any packages that it depends on.

## Launching tests

```
API_KEY={API_KEY} npm run test
```

Launches tests headless.

```
API_KEY={API_KEY} npm run dev
```

Launches tests non-headless with playwright inspector.

```
API_KEY={API_KEY} npm run headed
```

Launches tests non-headless.

## Docker
* Make sure you have [docker](https://www.docker.com/) installed.
* To run tests in the docker container, make sure docker is up and running and then run the command:

```
API_KEY={API_KEY} docker compose up
```

Where {API_KEY} is the api key of [mailslurp](https://www.mailslurp.com/) account provided in the email.
