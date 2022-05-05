# Getting started

## Start the API

Use either npm or yarn:

```bash
npm install
npm run generate
npm run start
```

## Try it out

Using Visual Studio Code + REST Client plugin (humao.rest-client):

* Open [test.http](resources/http/test.http)
* Run requests by pressing Ctrl + Alt + R

## List of apis

They are in `index.ts`

# Deploy stuff

## Buidding OCI/docker image

```bash
docker build -t hackatchlon-data .
```

## Starting image locally
```bash
docker run --name hackathlon-data -p 3000:3000 --rm hackathlon-data:latest
```

## Stopping local image
```bash
docker stop hackathlon-data
```
