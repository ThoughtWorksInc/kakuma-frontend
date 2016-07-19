# 4. jade as html template language

Date: 06/07/2016

## Status

Superseded ADR 7

## Context

We need an html template language because it helps to reduce development time and duplicate code.

## Decision

We chose Jade over Slim because:
* the team has experience using Jade
* it is widely used with excellent supporting documenting

## Consequences

The other option is to use Slim which is a Ruby gem as opposed to Jade which is a node library.
It may be easier to set up the development environment since this is currently proposed as a Ruby app.
