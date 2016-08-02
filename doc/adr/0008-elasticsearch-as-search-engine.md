# 8. ElasticSearch as Search Engine

Date: 29/07/2016

## Status

Accepted

## Context

We require a search engine to provide matching capability between the records, and to provide an associated confidence score for each match. Apache Solr was originally proposed as it formed the backbone of the RapidFTR matching algorithm, however several people (Atush) recommended we look at ElasticSearch, as it is newer and simpler to use and configure.

Amazon offer a hosted ElasticSearch product, which will further simplify the challenge of running a scalable search engine in production.

## Decision

We will use ElasticSearch for our search engine.

## Consequences

We won't be able to repurpose as much code from RapidFTR, if any.
