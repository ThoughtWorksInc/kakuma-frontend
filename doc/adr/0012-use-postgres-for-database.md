# 1. Use Postgres for database

Date: 02/09/2016

## Status

Accepted

## Context

We require a database to store the records input by users. The data we store will include some static components (eg, a UUID) and some changing elements, as the questions we ask of users will change as we learn more, and as we target different cultural groups, languages and countries.

As such we want to store unstructured data for the majority of the user's input (eg, a JSON document). A document database might be a good candidate, as we will probably need to query into this unstructured data efficiently.

Other considerations are the ease of setup, ease and cost of hosting, and security.

Postgres supports a native JSON datatype, that allows the storage, and querying of, unstructured JSON data. Documentation and support for Postgres is extensive.

Amazon offer Postgres as an option for RDS, relational database as a service. They also offer encryption of data at rest as an option. Hosting using AWS RDS is cost effective and simple to set up with encryption at rest.

Alternatives considered.
Mongo DB is a well known and understood document store, however to set up Mongo is a manual operation in both AWS and Heroku. (ie, we would have to provision, configure and maintain servers ourselves).

Heroku offer Postgres at low cost, however they only offer encryption of data at rest with their more expensive tiers ($200 per month).

## Decision

We have decided to use Postgres to store our records, using the native JSON data type for unstructured data that is likely to change (many of the questions we ask users, that will in turn be used for matching). We will also store structured data in the same tables, (such as UUID, phone number) that are needed to maintain the records, or are private and not used for matching (phone number).

## Consequences

As Heroku's encryption at rest database tier is very expensive, this will push us to migrate to Amazon's Elastic Beanstalk..
