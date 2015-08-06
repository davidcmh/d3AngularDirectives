# d3AngularDirectives
Customisable Angular directives for d3 charts.

See src/directives for source code of each chart directive. A README.md is included within src/directives to explain the general structure of each directive. There is also a demo dashboard app illustrating the use of directives in a simple Angular app.


###Incorporating d3 source code
There are two main ways to incorporate d3 source code. The most direct way is to include it within 'index.html', which exposes 'd3' variable to global namespace and can be called by any directive directly. Alternatively, it can be wrapped within a directive and listed as a dependency for each chart directive.
