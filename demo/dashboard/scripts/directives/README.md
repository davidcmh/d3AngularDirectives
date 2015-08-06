#General Structure for D3 Directives

##Overall concept
- DOM tree
    - Each d3 element is bound to a DOM element using append function
    
    - Example structure of a bar chart
        - DOM container: iElement[0]
            - append "svg"
                - append "g" for elements swithin this svg canvas, and applies overall transformation (this is essentially the container for the chart)
                    - append "g" for x-axis
                    - append "g" for y-axis
                    - append "g" for bars
                    - append "g" for bar labels

- Styling
    - Styles can be added within D3 or we can assign id/class to DOM element, and style them in CSS style sheet

## General Steps

### 1. Initialise SVG & binds it to DOM

### 2. Create "scope.watch" functions
i. Resizing of DOM container (iElement[0])
- height
- width

ii. Changes in data

### 3. Create render() function
i. Refresh SVG canvas
- Remove all items bound to SVG, using "svg.selectAll("*").remove()

ii. Get container's height & width + check if container has been initialised completely (gridster layout is not initialised at the first cycle, so be careful with it)

iii. Transform data into array form to work with data().enter()

iv. Set up chart's dimension & margin (based on overall container's height & width)

v. Create chart by appending "g" to SVG; transform/translate if necessary

vi. Add in chart components
- Define scales
    - x & y
        - define type of scale (ordinal/linear/time...) & range, range type (range/rangePoint/rangeBand) & domain
    - color

- Define axes
    - x & y
        - define scale to use & orientation & tickSize & ticks

- Create axes 
    - create new var for axis & append "g" to it
    - call axis function
    - text labels on axis ticks can be changed manually using selectAll("text"
    - append axis label if necessary

- Create bars

- Create bar labels

