# User Interface Controller Library

*Use this library to apply standards based interaction patterns to any HTML framework.* 


## What's the Problem?

1. ### There is no dedicated library focused simply on implementing standards based UI controller logic. 

  The [WAI ARIA](http://www.w3.org/TR/wai-aria/) standards describe a set of keyboard and mouse interactions for controlling almost any user interface widget. Implementing these standards should be a simple matter of incorporating a dedicated library into your website or application to control the widget interactions. But such a library does not exist. Most of this functionality is embedded into bigger front end frameworks, which differ in their implementation of these controls.

2. ### Front end frameworks are inconsistent in their implementation of ARIA standards. 

  Some are [more](http://foundation.zurb.com) or [less](http://getbootstrap.com) compliant while many just aren't. Most frameworks are not configurable in how they implement their UI controls, leaving website designers and developers powerless to craft unique user experiences or fine tune their ARIA compliance without hiring a team of JS and accessibility experts.

3. ### Custom user experience tools and widgets end up being much more expensive and cumbersome to develop. 
 
  Let's face it... the same old tabs, accordions, and drop down menus are getting old, but the "logic" that powers them will be usable for decades. We need a fresh new look to our HTML5 applications, without re-inventing the existing user experience paradigm.


## What is the Solution?

The User Interface Controller Library (UIX) is a collection of jQuery UI factory widgets that can be applied to any front end framework to provide display control of the underlying HTML elements (via ARIA standard mouse, keyboard, and touch interactions) without affecting the style or structure of the rendered output.

## How do I use this?

Download and include the UIX javascript files. 

    <html>
    <head> ...
    <script src="uix.js"/>
    </head>

Apply the widgets to existing HTML structures, using specialized `data-` attributes,

    <div id='#my-tabs-widget' data-tabs='{"key":"value"}' >...</div>

or the standard jQuery widget API

    $("#my-tabs-widget").tabs({"key":"value"});


## Gimme some Examples...

A working demo site may be found at [manimejia.me](http://manimejia.me). All the interactions on this site use the UIX library, specifically the UIX *Tabs* and *Accordion* widgets.


## A bit of back story...

This all started when I was deep into building a portfolio website on the Foundation HTML/CSS framework. I decided that I wanted the whole site to be keyboard accessible. On inspecting the documentation for Foundation, I found the most of the components didn't provide the functionality (especially the accessibility functionality) that I required for the project. Too deep into the site to change front end frameworks, I decided to write my own "tabs" and "accordion" controllers. A deeper exploration of the situation revealed that most front end frameworks differ in their ARIA compliance and don't have extensible controller logic.
