# A little program for finding a job

This program has two parts.
1. A producer to put a task to a beanstalkd tube for getting exchange rate.
2. A consumer to get a task from the tube, get the exchange rate and insert it to mongodb.

## Develop Environment

OS - Windows 7 64-bit
Nodejs - v8.11.1
NPM - v5.6.0
Mongodb - v3.0.6
beanstalkd - provided from other party

## Installation

```bash
npm i
```

## Config

All configs are in the */config* folder, fyr:
https://www.npmjs.com/package/config

## Lint

```bash
npm run lint
```

## Usage

1. Run the producer to seed a job
    ```bash
    npm run producer:dev
    ```

2. Run the consumer to process jobs
    ```bash
    npm run consumer:dev
    ```

* The consumer will not stop automatically.

## Check db & tube

```bash
npm run check
```

## Reset db & tube

```bash
npm run reset
```