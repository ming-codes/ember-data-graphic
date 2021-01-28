{{page-title "Core Concepts"}}

# Core Concepts

## Components

The main interface of `ember-data-graphic` is centered around 3 low-level components:

- `<DataGraphic::Frame />` acts as a container for image elements that would otherwise be hard to control sizing. A `<DataGraphic::Frame />` would contain multiple `<DataGraphic::Layer />` components and these layers are stacked on top of each other using absolute positioning.
- `<DataGraphic::Layer />` component encapsulates a specific render target. This can be SVG or Canvas. A `<DataGraphic::Layer />` would contain multiple `<DataGraphic::Mark />` components.
- `<DataGraphic::Mark />` component encapsulates a series of graphical elements like lines, rectangles, and circles.

## Layouts

Graphical elements are positioned using absolute positioning. So how are we going to move these rectangles into a bar chart? This is where layouts comes in.

Layouts are authored in JavaScript. It takes some data as input and emit spacial coordinates as outputs. Not all layouts work the same. Some are just simple functions and some others are object instances. Even more that maps inputs and outputs many-to-many. There are no strict definition in this regard.

Layouts are designed this way to maximize interoperability with the broader d3 ecosystem.

## Scales

While layouts emit positions in absolute coordinates, our screen elements needs to be responsive. This is where scales comes in. Scales are just mapping functions that convert data in a pre-configured manner. Scales can be instanciated from JavaScript or by `{{scale}}` helper.
