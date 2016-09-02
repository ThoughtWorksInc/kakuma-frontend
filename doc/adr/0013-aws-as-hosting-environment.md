# 13. AWS as hosting environment

Date: 02/09/2016

## Status

Accepted

Supercedes [5. heroku as hosting and deployment platform](0005-heroku-as-hosting-and-deployment-platform.md)

## Context

As the application scope grows, and we require a database and search engine for matching (ElasticSearch) we will require more services than Heroku can support easily, and have a greater appetite for managing the extra complexity of AWS based hosting.

Elastic Beanstalk provides a similar Platform as a Service (PaaS) model to Heroku, albeit not quite as simple, and more expensive (circa $14 per month minimum).

AWS RDS provides a very simple database as a service, with our chosed database (Postgres) and encryption at rest, at a very good price (similar to the app hosting).

Finally, AWS offers Elasticsearch as a service, with all aspects of hosting managed by Amazon. This represents a significant simplification over a self hosted search engine (for matching).

## Decision

We have decided to host the application in AWS Elastic Beanstalk, with Postgres and Elasticsearch also hosted in AWS as a service.

## Consequences

We will need to manage AWS IAM identities for all users who wish to configure and deploy to AWS. Billing will be arranged ThoughtWorks.
