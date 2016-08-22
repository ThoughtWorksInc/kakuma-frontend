# 11. Browserify for bundling JS files

Date: 22/08/2016

## Status

Proposed

## Context

As our javascript gets more and more complicated, we had to break our js application into seperate files. The only way to reference these files were to make

each file an object. This made testing a lot more difficult as we couldn't always map the dependencies each file had on another JS file.

## Decision

By using browserify you can split your JS in multiple files and folders and get organized however you wish. You just export modules from files and

require them into your application and browserify will do the rest of reading the requirements and bundling them.

Browserify takes on the responsibility of loading your dependencies as well as bundling them together in a single file which you then reference in your html.

## Consequences

We would have to add module.exports to export methods in each JS file that we'd like to use outside of that respective JS file
