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

Instantiate the widget behavior on existing HTML structures, using the custom `data-[widgetName]` attributes,

```html
<div id='#my-tabs-widget' data-tabs='{"key":"value"}' >...</div>
```

or the standard [jQuery UI API for instantiating widgets][JQUIAPI]

```javascript
$("#my-tabs-widget").tabs({"key":"value"});
```

Passing an *options* object in either case is purely optional, and only illustrated here for demonstration purposes. See below for available options for each widget. 

> **IMPORTANT:**

> "*When the `data-` attribute is an object (starts with '{') or array (starts with '[') then `jQuery.parseJSON` is used to parse the string; it must follow [valid JSON syntax][JSON] including **quoted property names**. If the value isn't parseable as a JavaScript value, it is left as a string.*"

> See [jQuery : HTML5 data-* Attributes][JQDATA]


## Available Widgets and Configurations

Currently there are four widgets available in the UIX library. Each one can be instantiated via a custom `data-` attribute or the jQuery UI widgets API, as described above. 

### Tabs Widget (`.tabs()`)

Your basic *Tabs* behavior can be applied to any HTML structure. Tabs can be displayed in any orientation (vertical or horizontal) and appear anywhere in the HTML document in relation to the tab panels they control. As with all UIX widgets, style and structure are entirely up to the designer. Bellow are the default (and all available) options for the Tabs widget:

Calling
```javascript
$("#my-tabs-widget").tabs();
```
is equivalent to calling
```javascript
$("#my-tabs-widget").tabs({
  navigateTabsByTabKey: false, // should both tab and arrow keys be used to navigate tabs
  expandPanelOnTabFocus: true, // should a panel be opened when it's tab has focus?
  focusPanelOnTabExpand: false, // should focus be set on the first focusable item in a panel when it is opened?
  focusTabOnPanelBlur: false, // should focus be sent back to the tab when "Shift+Tab" key is pressed from first panel focusable
  tabsMultiSelectable: false, // can multiple panels be open at once?
  tabsSelfClosable: false, // can an open panel be closed by it's own tab or only by opening another panel?
  navigateTabGridByArrowKeys: false, // should up and down arrow keys be used to navigate across rows if tabs span multiple rows?
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
  // Five properties are used to locate the "$component" elements in the HTML DOM.
  // The first three, "selector", "selectorContext", and "selectorDepth" 
  //  are used to define the jQuery selector used to locate the components directly in the DOM.
  // Alternatively, "relatedby" and "relationship" are used to identify 
  //  an aria relationship attribute on another DOM element in which this component's id is listed.
  components: {
    $tabList: { 
      selector:"[role='tablist']",
      relationship: "aria-owns",
      classes: {
        expanded:"has-active",
      },
    },
    $tabListItems: { 
      selector:"*",
      selectorContext: "$tabList",
      selectorDepth: 1,
      relatedby: "$tabList",
      relationship: "aria-owns",
      classes: {
        expanded:"active",
      },
    },
    $tabs: { 
      selector:"[role='tab']",
      selectorContext: "$tabList",
      relatedby: "$tabList",
      relationship: "aria-controls",
      classes:{
        focus: "focus",
        selected: "selected",
        expanded:"active",
      },
    },
    $panels: {
      selector:"[role='tabpanel']",
      relatedby: "$tabs",
      relationship: "aria-controls",              
      classes: {
        expanded:"active",
      },
      ajax: {
        urlAttributeName:'data-ajax-url',
        selectorAttributeName:'data-ajax-selector',
      },
    },
    $helpRegion: { 
      relatedby: "$tabList", 
      relationship: "aria-describedby",
    },
  },
});
```
You will see that the Tabs widget has an extensive collection of options that can be configured to suit different interaction patterns. This is illustrated in the next three widgets, which are simply different configurations of the UIX Tabs widget.

### Tabs Grid Widget (`.tabsGrid()` extends `tabs`)

This is a simple re-configuration of the UIX Tabs widget, that facilitates using the `UP` and `DOWN` arrow keys to navigate across rows in a grid of tabs. (a useful design pattern for the vertical tabs paradigm) It has available all the options of the Tabs widget. The only thing different are a couple default options:

Calling
```js
$("#my-tabsgrid-widget").tabsGrid();
```
is equivalent to calling
```js
$("#my-tabsGrid-widget").tabs({
  components:{
    $tabList:{selectorDepth:3},
  },
   navigateTabGridByArrowKeys: true,        
});
```

### Accordion Widget (`.accordion()` extends `tabs`)

This is a simple re-configuration of the UIX Tabs widget, to implement your basic accordion behavior on any HTML structure. Typically Accordions differ from Tabs in three main ways: display, structure, and behavior. The display and HTML structure of typical Accordion widgets is to have *headers* and *panels* positioned "inline" (one after the other). The Typical behavior of an Accordion is not to open a panel when it's header has keyboard focus (like Tabs widgets), but rather when it is *activated* by keyboard or mouse click. The UIX Accordion widget, like any UIX widget, does not depend on or manipulate the rendered display or HTML structure. How UIX differentiates between Tabs and Accordions is by the behavior assigned. Bellow is the default configuration for a UIX Accordion widget:

Calling
```js
$("#my-accordion-widget").accordion();
```
is equivalent to calling
```js
$("#my-accordion-widget").tabs({
  expandPanelOnTabFocus: false,
  focusPanelOnTabExpand: true,
  focusTabOnPanelBlur: true,
  components:{
    $tabList:{selectorDepth:0},
  },
  tabsSelfClosable: true,
  effect: 'slide',
  effectOptions: {duration:200},
  queueOpeningEffect: false,
});
```

### Accordion Grid Widget (`.accordionGrid()` extends `accordion`)
This is a simple re-configuration of the UIX Accordion widget. It implements the behavior for rendering a grid of expandable elements, similar to the results listing page for a [Google image search][GISH].

Calling
```js
$("#my-accordionGrid-widget").accordionGrid();
```
is equivalent to calling
```js
$("#my-accordionGrid-widget").accordion({
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
