# 9. Datamapper as ORM

Date: 19/08/2016

## Status

Proposed

## Context

We need an ORM to assist with creating and reading from the database.

## Decision

1. the Data Mapper style completely separates your domain from the persistence layer. None of model objects will know anything about the database and how they are stored.

2. It will also help to store data in the form of objects that we need stored in the database e.g. JSON

## Consequences

There will be a stricter, more formal process for interacting with the database because you can’t just call the save method anywhere in your code.

There are also other ORM like ActiveRecord but it seems to have more 'magic', and well suited to Ruby on Rails.
