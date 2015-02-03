# User Interface Controllers (UIX)

*Use the UIX Widget Library to apply standards based widget interaction patterns on top of any HTML structure or framework.* 


## What's the Problem?

1. ### There is no dedicated library focused simply on implementing standards based UI controller logic. 

  The [WAI ARIA](http://www.w3.org/TR/wai-aria/) standards describe a set of keyboard and mouse interactions for controlling almost any user interface widget. Implementing these standards should be a simple matter of incorporating a dedicated library into your website or application to control the widget interactions. But such a library does not exist. Most of this functionality is embedded into bigger front end frameworks, which differ in their implementation of these controls.

2. ### Front end frameworks are inconsistent in their implementation of ARIA standards. 

  Some are [more](http://foundation.zurb.com) or [less](http://getbootstrap.com) compliant while many just aren't. Most frameworks are not configurable in how they implement their UI controls, leaving website designers and developers powerless to craft unique user experiences or fine tune their ARIA compliance without hiring a team of JS and accessibility experts.

3. ### Custom user experience tools and widgets end up being much more expensive and cumbersome to develop. 
 
  Let's face it... the same old tabs, accordions, and drop down menus are getting old, but the "logic" that powers them will be usable for decades. We need a fresh new look to our HTML5 applications, without re-inventing the existing user experience paradigm.


## What is the Solution?

The User Interface Controller (UIX) Widget Library is a collection of jQuery UI factory widgets that can be applied to any front end framework to provide display control of the underlying HTML elements (via ARIA standard mouse, keyboard, and touch interactions) without affecting the style or structure of the rendered output.

> **REMEMBER**

> **The UIX Widget Library is non-presentational.** That means it will not provide any CSS styles or CSS classes to alter the look of the rendered presentation. Nor will it modify the underlying HTML in any way to accomplish the desired UI functionality. While this frees up designers to come up with novel and unique designs on which to implement standards based widget interactions, it also forces designers to use a custom or third party CSS framework to accomplish this.

To summarize... This library defines the mouse, keyboard, and touch interactions that control the display (remote loading, hiding, showing, and animating) of common element groups in an HTML document. These *common element groups* are collectively known as widgets.


## How do I use the UIX Widget Library?

Download and include the UIX Widget Library and required [jQuery][JQ] and [jQuery UI][JQUI] javascript files at the bottom of your HTML `<body>`. Required dependencies for UIX are jQuery 1.8+ and two files (*Core* and *Widget*) from jQuery UI 1.11.2+. No jQuery UI widgets or effects are depended on by UIX. But if UI effects available, effects may be used for UIX widget transitions. 
	
```html
<html>
<head>
...
</head>
<body>
...
<script src="/jquery.js"/>
<script src="/jquery-ui.js"/>
<script src="/uix-widgets.js"/>
</body>
</html>
```

Instantiate the widget behavior on existing HTML structures, by adding a `data-[widget]` attribute.  This attribute may contain a value of space separated `configTokens`, which will be used to apply configuration presets to the options of this widget instance. Any additional `data-[widget]-[option]` attributes are uses to further tweak the options of this widget instance.

```html
<div id="#my-tabs-widget" data-tabs="token token" data-tabs-[option]="value" >...</div>
```

or the standard [jQuery UI API for instantiating widgets][JQUIAPI], in which the widget is passed options 

```javascript
$("#my-tabs-widget").tabs({
  configTokens:["token","token"],
  option:"value",
  ...
  });
```

Assigning a value to the "data-[widget]" HTML attribute, or having any "data-[widget]-[option]" HTML attributes present, or passing an *options* object via javascript are all purely optional methods of configuring the widget options. They are only illustrated here for demonstration purposes. See below for a list of the available options to pass for each widget. 


## Available Widgets and Configurations

Currently there is one widget available in the UIX library, the "tabs" widget. This can be configured in a number of ways via custom `data-` attributes or the jQuery UI widgets API, as described above. 

### Tabs Widget

This is a very versatile widget for adding generic *tab switching* behavior to any collection of HTML elements. This behavior can be summarized as follows: 
 1. A collection of elements is identified as being `tabs`
 2. Another collection is identified as being `panels`. 
 3. The `tabs` elements control the hiding and showing of the `panel` elements. 

The versatility of this widget is exemplified by the preset configurations that are available. 
 - *tabs* (default) - used to control a typical tabbed layout, where:
    - The `tabs` and `panels` are listed separately in the HTML structure.
    - A `panel` is toggled when it's `tab` is clicked
    - only one `panel` can be displayed at a time
 - *accordion* - used to control a typical accordion layout, where:
    - the `tabs` and `panels` are listed *inline* (one after the other) in the HTML structure
    - A `panel` is toggled when it's `tab` is clicked
    - multiple `panels` may be displayed at a time
    - `panels` are animated on opening and closing
 - *accordionGrid* - used to control a layout similar to "google image search", where:
    - all the *accordion* behaviors are applied
    - A `panel` will be opened by default, if it's ID appears as the URL `location.hash`
    - the window will scroll to the location of a newly opened `panel`
    - The parent element of an active `tab`/`panel` pair will have it's `padding` modified to accommodate the `panel` height, even if it changes.
 - *slider* - used to control a typical image "carousel" or content "slider", where:
    - A `panel` is toggled when it's `tab` is clicked
    - only one `panel` can be displayed at a time
    - `panels` may be navigated as a continuous loop

#### Tabs (Default Tabs Widget Configuration)

Tabs can be displayed in any orientation (vertical or horizontal) and appear anywhere in the HTML document in relation to the tab panels they control. As with all UIX widgets, style and structure are entirely up to the designer. Bellow are the default (and all available) options for the Tabs widget:

Adding
```html
<div id="my-tabs-widget" data-tabs>...</div>
```
Or Calling
```javascript
$("#my-tabs-widget").tabs();
```
is equivalent to calling
```javascript
$("#my-tabs-widget").tabs({
  configTokens: [], // set this to the string identifier of a settings preset to use ... see : getCreateOptions().
  navigateTabsByTabKey: false, // should both tab and arrow keys be used to navigate tabs
  expandPanelOnTabFocus: true, // should a panel be opened when it's tab has focus?
  focusPanelOnTabExpand: false, // should focus be set on the first focusable item in a panel when it is opened?
  focusTabOnPanelBlur: false, // should focus be sent back to the tab when "Shif+Tab" key is pressed from first panel focusable
  tabsMultiSelectable: false, // can multiple panels be open at once?
  tabsSelfClosable: false, // can an open panel be closed by it's own tab or only by opening oanother panel?
  navigateTabGridByArrowKeys: false, // should up and down arrow keys be used to navigate accros rows if tabs span multiple rows?
  navigateTabsAsCircularLoop: false, // should navigation keys loop to the other end when the end is reached in a group of tabs?
  scrollOnOpen: false, // should the browser window be scrolled to the top of a newly opened panel?
  updateLocationHash: false, // should the browser's location hash be updated when a panel is opened?
  getExpandedTabFromLocationHash: false, // test
  setLocationHashToExpandedTab: false, // test
  defaultExpandedId: '', // specify the ID of a tab or panel to be opened when the tabgroup is instantiated.
  effect: 'none', // which effect should be used to hide/show the panels ['fade', 'slide', 'none']
  effectOptions: {duration:0}, // an options object to be passed to effect calling function
  queueOpeningEffect: true, // should the opening effect be delayed till closing operations are complete
  sync: function(tabgroup){return null;}, // this is a function that will be called by setInterval. Use it to keep dynamic layouts in order.
  syncInterval: 0, // number of milliseconds between each calling of the sync function

  // callbacks
  tabSelect: null,
  tabSelected: null,
  panelExpand: null,
  panelExpanded: null,
  ajaxPanelContentRequested: null,
  ajaxPanelContentLoaded: null,

  // The "components" option allows for this widget to be applied to any variety of HTML structures. 
  // Each "$component" key represents an HTML DOM element that this widget will reference and manipulate
  // Allowed values for "UIX selector" properties can be any jQuery selector or a key from this components{} object.
  //  'element' is the default value for any "UIX selector", and will reference the element on which the widget is instantiated
  components: {
    tabList: { // The $tabList component identifies the elements that "own" all $tab components
      selector:"[role~='tablist']", // This "UIX Selector" value will select the elements for this component. 
      selectorContext: "element", // This "UIX Selector" value will identify the context in which the above selection is made.
      selectorDepth: "", // This "number" value represents the "depth" at which to search "context" for "selector". 
                           // A value of 1+ will run `context.find(selector)` at the indicated child level. 
                           // A value of 0 will run `context.filter(selector)` returning members of the context collection.
                           // A value of null, undefined, or "" (default) will run `context.find(selector)`
      relationship: "aria-owns", // This "string" value represents the name of an [aria relationship attribute](http://www.w3.org/TR/wai-aria/states_and_properties#attrs_relationships)
      relatedby: "element", // This "UIX selector" value will identify the element on which the above relationship attribute is present.
                            // The attribute should contain a space or comma separated list of IDs representing the elements of this component.
                            // If present, the IDs found in this attribute will override the "selector..." properties in selecting elements for this component.
      classes: {
        selected:"",
        focus:"",
        expanded:"has-active",
      },
    },
    tabListItems: { // The $tabListItems component identifies the outermost "wrapper" element of each $tab component
      selector:"*",
      selectorContext: "$tabList",
      selectorDepth: 1,
      relatedby: "$tabList",
      relationship: "aria-owns",
      classes: {
        selected:"",
        focus:"",
        expanded:"active",
      },
    },
    tabs: { // The $tabs component identifies the elements to be used as tabs (usually <a> links elements) 
      selector:"[role~='tab']",
      selectorContext: "$tabList",
      relatedby: "$tabList",
      relationship: "aria-controls",
      classes:{
        focus: "focus",
        selected: "selected",
        expanded:"active",
      },
    },
    panels: { // The $panels component identifies the content elements that will be hidden and shown by eacn $tabs
      selector:"[role~='tabpanel']",
      relatedby: "$tabs",
      relationship: "aria-controls",              
      classes: {
        expanded:"active",
      },
      ajax: { // The ajax property configures if and how ajax content will be loaded into the elements of this component
        urlAttributeName:'data-ajax-url', // where to find the URL of the document to be retrieved by ajax()
        selectorAttributeName:'data-ajax-selector', // where to find the selector which will extract content from the documant returned by ajax()
      },
    },
    next:{ // the $next component identifies the button element that will activate the "next" tab in the $tablist.
      selector:"button[name='next'],[role~='button'][name='next']",
      selectorContext: "$tabList",
    },
    previous:{ // the $previous component identifies the button element that will activate the "previous" tab in the $tablist.
      selector:"button[name='previous'],[role~='button'][name='previous']",
      selectorContext: "$tabList",
    },
    helpRegion: { // the $helpRegion is a planned feature, not implemented yet
      relatedby: "$tabList", 
      relationship: "aria-describedby",
    },
  },
});
```


#### Accordion (Tabs Widget Configuration)

This configuration will implement your basic accordion behavior on any HTML structure. Typically Accordions differ from Tabs in three main ways: display, structure, and behavior. The display and HTML structure of typical Accordion widgets is to have *headers* and *panels* positioned "inline" (one after the other). The Typical behavior of an Accordion is not to open a panel when it's header has keyboard focus (like Tabs widgets), but rather when it is *activated* by keyboard or mouse click. The UIX Accordion widget, like any UIX widget, does not depend on or manipulate the rendered display or HTML structure. How UIX differentiates between Tabs and Accordions is by the behavior assigned. Bellow is the default configuration for a UIX Accordion widget:

Adding
```html
<div id="my-accordion-widget" data-tabs="accordion">...</div>
```
Or Calling
```js
$("#my-accordion-widget").tabs({configTokens:["accordion"]});
```
is equivalent to calling
```js
$("#my-accordion-widget").tabs({
  expandPanelOnTabFocus: false,
  focusPanelOnTabExpand: true,
  focusTabOnPanelBlur: true,
  components:{
    tabList:{selectorDepth:0},
  },
   tabsSelfClosable: true,
   effect: 'slide',
   effectOptions: {duration:200},
   queueOpeningEffect: false,
});
```

#### Accordion Grid (Tabs Widget Configuration)

This configuration implements the behavior for rendering a grid of expandable elements, similar to the results listing page for a [Google image search][GISH].

Adding
```html
<div id="my-accordionGrid-widget" data-tabs="accordionGrid">...</div>
```
Or Calling
```js
$("#my-accordionGrid-widget").tabs({configTokens:["accordionGrid"]});
```
is equivalent to calling
```js
$("#my-accordionGrid-widget").accordion({
  configTokens : ["accordion"],
  navigateTabGridByArrowKeys: true,
  scrollOnOpen: true,
  updateLocationHash: true,
  effectOptions: {
        duration:200,
        step : function(now,fx){
          if(fx.prop == 'height')
          $(fx.elem).parent().css('padding-bottom',now+'px');
        },
      },
  sync: function(tabgroup){
      tabgroup.$panels.filter('[aria-hidden="false"]').each(function(){
          var tabpanelHeight = $(this).height();
          $(this).parent().css('padding-bottom',tabpanelHeight+'px');
      });
    },
  syncInterval: 500,
});
```

## Gimme some Examples...

A working demo site may be found at [manimejia.me](http://manimejia.me). All the interactions on this site use the UIX library, specifically the UIX **Tabs Grid** and **Accordion Grid** widgets. Additional demos and examples will follow.


## A bit of back story...

This all started when I was deep into building a portfolio website on the Foundation HTML/CSS framework. I decided that I wanted the whole site to be keyboard accessible. On inspecting the documentation for Foundation, I found the most of the components didn't provide the functionality (especially the accessibility functionality) that I required for the project. Too deep into the site to change front end frameworks, I decided to write my own "tabs" and "accordion" controllers. A deeper exploration of the situation revealed that most front end frameworks differ in their ARIA compliance and don't have extensible controller logic.


[JQ]: http://jquery.com/download/
[JQUI]:  http://jqueryui.com/download/#!version=stable&themeParams=none&components=1100000000000000000000000000000000000
[JQUIAPI]: http://learn.jquery.com/jquery-ui/getting-started/#basic-overview-using-jquery-ui-on-a-web-page
[JQDATA]: http://api.jquery.com/data/#data-html5
[JSON]: http://en.wikipedia.org/wiki/JSON#Data_types.2C_syntax_and_example
[GISH]: https://www.google.com/search?q=dog&tbm=isch
