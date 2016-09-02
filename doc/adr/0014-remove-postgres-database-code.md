# 14. remove postgres database code

Date: 02/09/2016

## Status

Accepted

Supercedes [1. Use Postgres for database](0012-use-postgres-for-database.md)

## Context

TW involvement with the Kakuma project is coming to an end, with active development now halted. The database persistence code developed so far did not include sufficient security to store private data from real users. In addition, matching and reunification work had not started, so there was no case to use the personal data once stored, and no interface to access it.

Removal of datbase code also simplifies the application in terms of deployment, re-introducing the possibility of hostin on a Heroku free account.

## Decision

We are going to delete the portions of the code which write to the database.

## Consequences

We need to delete the database resources in AWS and all backups. These only contain dev generated test data.
