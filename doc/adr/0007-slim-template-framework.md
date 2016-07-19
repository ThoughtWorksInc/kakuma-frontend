# 7. Slim Template Framework

Date: 07/07/2016

## Status

Accepted

## Context

We require an HTML templating language to speed up development, reduce code duplication and improve readability. Jade was originally proposed as it is a popular choice within the industry, and it had been used previously by the team.

## Decision

We decided to move to Slim as Jade ran on Node.js and we were looking to make a lightweight app with as few dependencies as possible. Slim runs on ruby, and we felt that would be less restrictive in the long term. The syntax for Slim and Jade is more or less identical, though Slim does not feature Mixins.

## Consequences

In trying to avoid any dependency on Node, we are effectively removing ourselves from being able to use node packages in the future. This includes popular build tools such as Grunt/Gulp, though Ruby alternatives like Rake do exist.
