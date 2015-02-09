/**
 * User Interface Controller Library (UIX)
 *
 * a collection of jQuery UI factory widgets that can be applied to any 
 * front end framework to provide display control of the underlying HTML elements 
 * (via ARIA standard mouse, keyboard, and touch interactions) without affecting 
 * the style or structure of the rendered output.
 *
 * Copyright (c) 2015 Manuel Mejia
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
 
 
/**
 * UIX pluggins for jQuery:
 * - `$().normalHref()` : normalizes the href attribute for retrieval in IE7 if it might have been set by javascript
 * - `$().aria(attr,value,tokenOpp)` : a shortcut for calling `$().attr( 'aria-'+attr, value , tokenOpp )`
 * - `$().attr( attr, value , tokenOpp )` : adds a third argument to enable processing of token lists
 * - `$().attrAddToken(attr,value)` : modified `$().addClass(className)` to work with any kind of attribute
 * - `$().attrRemoveToken(attr,value)` : modified `$().removeClass(className)` to work with any kind of attribute
 * - `$().attrToggleToken(attr,value,stateVal)` : modified `$().toggleClass(className,stateVal)` to work with any kind of attribute
 * - `$().attrHasToken(attr,value)` : modified `$().hasClass(className)` to work with any kind of attribute
 *
 */
(function( jQuery ) {  

var rclass = /[\t\r\n\f]/g;
var rnotwhite = /\S+/g;

// plugins
jQuery.fn.extend({
  normalHref: function(){
    // jQuery support: IE7
    // IE7 doesn't normalize the href property when set via script (issue #9317)
    var anchor = this.get(0).cloneNode( false );
    return anchor.href(); 
  },
  
  aria: function(attr,value,tokenOpp){
    return this.attr('aria-'+attr,value,tokenOpp);
  },
  
  attr: function( attr, value , tokenOpp , state) {
     var tokenFuncion = 
         tokenOpp === 'add' ? 'attrAddToken' :
         tokenOpp === 'remove' ? 'attrRemoveToken' :
         tokenOpp === 'toggle' ? 'attrToggleToken' : // uses the `state` attribute
         tokenOpp === 'has' ? 'attrHasToken' :
         null;
     if( tokenFuncion ){
       return this[tokenFuncion](attr,value,state);
     }
    return jQuery.access( this, jQuery.attr, attr, value, value !== undefined );
  },

  attrAddToken: function( attr, value ) {
    var values, elem, curValue, newValue, j, finalValue, getValue,
      attrIsString = typeof attr === "string" && attr,
      valueIsString = typeof value === "string" && value,
      i = 0,
      len = this.length;

    if (attrIsString && jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).attrAddToken( attr, value.call( this, j, this.getAttribute(attr) ) );
      });
    }

    if (attrIsString && valueIsString ) {
      // The disjunction here is for better compressibility (see removeClass)
      values = ( value || "" ).match( rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        getValue = elem.getAttribute(attr);
        curValue = elem.nodeType === 1 && ( getValue ?
          ( " " + getValue + " " ).replace( rclass, " " ) :
          " "
        );

        if ( curValue ) {
          j = 0;
          while ( (newValue = values[j++]) ) {
            if ( curValue.indexOf( " " + newValue + " " ) < 0 ) {
              curValue += newValue + " ";
            }
          }

          // only assign if different to avoid unneeded rendering.
          finalValue = jQuery.trim( curValue );
          if ( getValue !== finalValue ) {
            elem.setAttribute(attr,finalValue);
          }
        }
      }
    }

    return this;
  },

  attrRemoveToken: function( attr, value ) {
    var values, elem, curValue, newValue, j, finalValue, getValue,
      attrIsString = typeof attr === "string" && attr,
      valueIsString = arguments.length === 1 || typeof value === "string" && value,
      i = 0,
      len = this.length;

    if ( attrIsString && jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call( this, j, this.getAttribute(attr) ) );
      });
    }
    if ( attrIsString && valueIsString ) {
      values = ( value || "" ).match( rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        getValue = elem.getAttribute(attr);
        // This expression is here for better compressibility (see addClass)
        curValue = elem.nodeType === 1 && ( getValue ?
          ( " " + getValue + " " ).replace( rclass, " " ) :
          ""
        );

        if ( curValue ) {
          j = 0;
          while ( (newValue = values[j++]) ) {
            // Remove *all* instances
            while ( curValue.indexOf( " " + newValue + " " ) > -1 ) {
              curValue = curValue.replace( " " + newValue + " ", " " );
            }
          }

          // Only assign if different to avoid unneeded rendering.
          finalValue = value ? jQuery.trim( curValue ) : "";
          if ( getValue !== finalValue ) {
            elem.setAttribute(attr,finalValue);
          }
        }
      }
    }

    return this;
  },

  attrToggleToken: function( attr, value, stateVal ) {
    var typeOfAttr = typeof attr, 
        typeOfValue = typeof value;

    if ( typeof stateVal === "boolean" && typeOfValue === "string" &&  typeOfAttr === "string" ) {
      return stateVal ? this.attrAddToken( attr, value ) : this.attrRemoveToken( attr, value );
    }

    if ( typeOfAttr === "string" && jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).attrToggleToken(
          attr, value.call(this, i, this.getAttribute(attr), stateVal), stateVal
        );
      });
    }

    return this.each(function() {
      if ( typeOfAttr === "string" && typeOfValue === "string" ) {
        // Toggle individual class names
        var newValue,
          i = 0,
          self = jQuery( this ),
          values = value.match( rnotwhite ) || [],
          getValue, finalValue;

        while ( (newValue = values[ i++ ]) ) {
          // Check each className given, space separated list
          if ( self.attrHasToken( attr, newValue ) ) {
            self.attrRemoveToken( attr, newValue );
          } else {
            self.attrAddToken( attr, newValue );
          }
        }

      // Toggle whole class name
      } else if ( typeOfAttr === "string" && value === undefined || typeOfValue === "boolean" ) {
        getValue = elem.getAttribute(attr);
        if ( getValue ) {
          // store className if set
          jQuery.data( this, "__"+attr+"Value__", getValue );
        }

        // If the element has a class name or if we're passed `false`,
        // then remove the whole classname (if there was one, the above saved it).
        // Otherwise bring back whatever was previously saved (if anything),
        // falling back to the empty string if nothing was stored.
        finalValue = getValue || value === false ?
          "" :
          jQuery.data( this, "__"+attr+"Value__" ) || "";
        this.setAttribute(attr,finalValue);
      }
    });
  },

  attrHasToken: function( attr, value ) {
    var attr = typeof attr === "string" ? attr : false,
        value = typeof value === "string" ? " " + value + " " : false,
      i = 0,
      l = this.length;
    if(attr && value){
      for ( ; i < l; i++ ) {
        if ( this[i].nodeType === 1 &&
          (" " + this[i].getAttribute(attr) + " ").replace(rclass, " ").indexOf( value ) > -1 ) {

          return true;
        }
      }
    }

    return false;
  }
});
}(jQuery));


(function( $ ) {
  
// define uix common fiunctionality
$.uix = $.uix || {};

$.extend( $.uix, {
  version: "0.01",  
  init : function($context){
    var widgetFullName = '',
        widgetName = '',
        $initialized = $(),
        widgets = this.widgets();
    for ( index in widgets ) {
      widgetName = widgets[index];
      dataAttributeName = widgetName;
      dataAttributeName = dataAttributeName.toLowerCase();
      $('[id][data-'+dataAttributeName+']',$context).each(function(){
        options = $.uix.getOptionsHtmlData(widgetName,this);
        // var options = $(this).data(dataAttributeName); 
        // options = typeof options === 'object' ? options :
        //           typeof options === 'string' ? {"defaults":options.split(' ')} :
        //           typeof options === 'array' ? {"defaults":options} :
        //           {};
        //         // $(this).removeAttr('data-'+dataAttributeName);
        
        // TODO : add a private and a public callback for `ajaxPanelContentLoaded` event
        // and move the call to `foundation()` to the a site specific implementation of the public callback
        options.ajaxPanelContentLoaded = function(event,uix){
          // console.log('Calling ajaxPanelContentLoaded(event,uix)');
          // console.log('event : %O',event);
          // console.log('uix : %O',uix);
          uix.$panel.find(':focusable').toggleClass('focusable',true);
          uix.$panel.foundation();
          $.uix.init(uix.$panel);
        }
        $(this)[widgetName](options);
        $initialized.add(this);
      });
    }
    return $initialized;
  },
  getOptionsHtmlData : function(widgetName, element){
    widgetName = typeof widgetName === 'string' ? widgetName : $.Widget.prototype.widgetName;
    var data =	$(element).data() || {},
        dataKeyMap = this.getOptionsHtmlDataKeyMap(widgetName),
        //defaultConfiguration = this[widgetName].prototype.configurations["default"],
        dataOptions = {};

    for(key in data){
      if(key === widgetName.toLowerCase()){
        //dataOptions["defaults"] = data[key].split(' ');
        $.extend(true,dataOptions,
          typeof data[key] === 'object' ? data[key] :
          typeof data[key] === 'string' ? {"tokens":data[key].split(' ')} :
          typeof data[key] === 'array' ? {"tokens":data[key]} :
          {}
        );
      }
      // TODO compare key to values in dataKeyMap...
      else if(key.indexOf(widgetName+'.') === 0){
        dataOptions[key.substring(widgetName.length+1)] = data[key];
      }
      // compare key to keys in dataKeyMap ...
      else if(dataKeyMap[key]){
        dataOptions[dataKeyMap[key]] = data[key];
      }
    }
    return dataOptions;
  },
  getOptionsHtmlDataKeyMap : function(widget, options, path){
    widget  = widget instanceof $.Widget ? widget : 
              typeof widget === 'string' ? $.uix[widget].prototype :
              $.Widget.prototype,
    options = typeof options === 'object' ? options :
              widget.configurations ? widget.configurations["default"] :
              {} , 
    path    = path && path.length ? path : [widget.widgetName.toLowerCase()];
    var dataKeyMap = {},
        dataKey = "";
    for(key in options){
      if(typeof options[key] === "object"){ 
        $.extend(dataKeyMap,this.getOptionsHtmlDataKeyMap(widget,options[key],path.concat(key)));
      }else{
        $.each(path.concat(key),function(index,value){
          dataKey = index === 0 ? value : dataKey + value.charAt(0).toUpperCase() + value.slice(1);//.toLowerCase();
        });
        dataKeyMap[dataKey] = path.concat(key).slice(1).join('.');
      }
    }
    return dataKeyMap;
  },
  getWidgetConfiguration : function(widget,tokens){
    widget = typeof widget === 'string' && $.uix[widget] ? $.uix[widget].prototype : 
             typeof widget === 'object' && widget.options && widget.configurations ? widget :
             {};
    tokens = tokens && tokens.length ? tokens : widget.options.tokens || [];
    var configurations = widget.configurations || {},
        configurationSet = {},
        widgetConfiguration = {};
    for(index in tokens){
      configurationSet = configurations[tokens[index]] || {};
      if(configurationSet.tokens && configurationSet.tokens.length){
        $.extend(true,configurationSet,$.uix.getWidgetConfiguration(widget,configurationSet.tokens));
      }
      $.extend(true,widgetConfiguration,configurationSet);
    }
    return widgetConfiguration;
  },
  defaults : function(widgetName){
    //return $.uix[widgetName].prototype.defaults;
  },
  widgets : function(){
    return Object.keys($.uix).filter(function(key){
      return $.uix[key] && $.uix[key].prototype ? $.uix[key].prototype instanceof $.Widget : false;
    });
  },
  scrollToElement : function(elementId,updateLocation){
    var $target = $(elementId);
    if($target.length >0 ){
      var scrollOffset = Number($target.attr('data-scroll-offset')) || 0;
      var targetOffset = 0;
      if($target.offset()){
        targetOffset = $target.offset()['top'];
      }else{
       targetOffset = $target.offsetParent().offset()['top'];
       targetOffset = targetOffset + $target.position()['top'];
      }
      if($('body').hasClass('f-topbar-fixed')) targetOffset -= 45;
      // console.log('scrollTo : '+elementId+' ('+targetOffset+')');
      // console.log($target.offset());
      $('html, body').stop().animate({
          'scrollTop': targetOffset + scrollOffset
      }, 900, 'swing', function () {
          if(updateLocation) window.location.hash = $target.attr('id');
      });
    }
  },
  isLocalHref: (function() {
    var rhash = /#.*$/;

    return function( href ) {
      var anchorUrl = href.replace( rhash, "" ),
          locationUrl = location.href.replace( rhash, "" );

      // decoding may throw an error if the URL isn't UTF-8 (#9518)
      try {
        anchorUrl = decodeURIComponent( anchorUrl );
      } catch ( error ) {}
      try {
        locationUrl = decodeURIComponent( locationUrl );
      } catch ( error ) {}

      return anchor.hash.length > 1 && anchorUrl === locationUrl;
    };
  })(),
  
  templates : {
    componentSelector : {
       selector         : "*",
       selectorContext  : "element",
       selectorDepth    : "",
       relatedby        : "",
       relationship     : "",
    },
    componentClasses : {
       created      :  "", 
       initialized  :  "", 
       focused      :  "", 
       selected     :  "", 
    },
  },
});


/*
Ajaxfailed
data-tabs="slider foundation"
data-tabs-behavior-navigate-by-tab-key=""
data-tabs-effect-panel-expanded=""
data-tabs-effect-panel-expanded-options=""
data-tabs-effect-panel-expanded-delay=""
data-tabs-component-tablist-depth="0"
data-tabs-class-tablist-expanded="current"
data-tabs-attribute-panel-ajax-url=""
data-tabs-attribute-panel-ajax-selector=""

include:[] // Array[string] array of tokens
expand:[] // Array[string]

behaviorTabKeyNavigation
behaviorGridNavigation
behaviorLoopNavigation
behaviorExpandOnTabFocus
behaviorFocusPanelOnExpand
behaviorFocusTabOnPanelBlur
behaviorScrollPageOnExpand
behaviorExpandMultiple
behaviorClosable
behaviorUpdateLocationHash
behaviorReadFromLocationHash

effectPanelExpand
effectPanelExpandOptions
effectPanelExpandDelay
effectSlideshow
effectSlideshowOptions
effectSlideshowDelay

componentTablistSelector
componentTablistDepth
componentTablistContext
componentTablistRelatedby
componentTablistRelationship

componentTablistitemSelector
componentTablistitemDepth
componentTablistitemContext
componentTablistitemRelatedby
componentTablistitemRelationship

componentTabSelector
componentTabDepth
componentTabContext
componentTabRelatedby
componentTabRelationship

componentPanelSelector
componentPanelDepth
componentPanelContext
componentPanelRelatedby
componentPanelRelationship

componentPreviousSelector
componentPreviousDepth
componentPreviousContext
componentPreviousRelatedby
componentPreviousRelationship

componentNextSelector
componentNextDepth
componentNextContext
componentNextRelatedby
componentNextRelationship

componentHelplistSelector
componentHelplistDepth
componentHelplistContext
componentHelplistRelatedby
componentHelplistRelationship

classTablistFocused
classTablistSelected
classTablistExpanded
classTablistCollapsed
classTablistAjaxbusy
classTablistAjaxloaded
classTablistAjaxfailed

classTablistitemFocused
classTablistitemSelected
classTablistitemExpanded
classTablistitemCollapsed
classTablistitemAjaxbusy
classTablistitemAjaxloaded
classTablistitemAjaxfailed
classTablistitemNext
classTablistitemPrevious

classTabFocused
classTabSelected
classTabExpanded
classTabCollapsed
classTabAjaxbusy
classTabAjaxloaded
classTabAjaxfailed
classTabNext
classTabPrevious

classPanelFocused
classPanelSelected
classPanelExpanded
classPanelCollapsed
classPanelAjaxbusy
classPanelAjaxloaded
classPanelAjaxfailed
classPanelNext
classPanelPrevious
    
helpNavigateByArrowKeysContent
helpNavigateByArrowKeysCondition
helpNavigateByArrowKeysSort
    
onTabFocused
onTabSelected
onTabExpanded
onTabCollapsed
onTabAjaxBusy
onTabAjaxLoaded
onTabAjaxFailed

onSyncInterval
onSyncIntervalDuration

*/


$.widget( "uix.tabs", {version: "0.01"});

$.uix.tabs.prototype.templates = $.extend(true, {} , $.uix.templates , {
  componentClasses : {
    expanded     :  "",
    collapsed    :  "",
    ajaxbusy     :  "",
    ajaxloaded   :  "",
    ajaxfailed   :  "",
  },
});


$.uix.tabs.prototype.configurations = {
  "default":{
    tokens: [], // set this to the string identifier of a settings preset to use ... see : getCreateOptions().
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
    // helpRegionId: '', // 
    helptext:{ // help text to be added to the help region
      navigateTabsByArrowKeys :{
        content:    "Use the <key>&rarr;</key> and <key>&larr;</key> arrow keys to navigate through the tabs.",
        condition: {navigateTabsByTabKey:false},
        sort:10,
      },
      navigateTabsByTabKey :{
        content:    "Use the <key>&rarr;</key> and <key>&larr;</key> arrow keys or <key>TAB</key> and <key>SHIFT</key>+<key>TAB</key> keys to navigate through all tabs",
        condition: {navigateTabsByTabKey:true},
        sort:20,
      },
      navigateTabGridByArrowKeys :{
        content:    "Use the <key>&uarr;</key> and <key>&darr;</key> arrow keys to navigate vertically across rows of tabs.",
        condition: {navigateTabGridByArrowKeys:true},
        sort:30,
      },
      navigateTabContentByTabKey :{
        content:    "Use the <key>TAB</key> and <key>SHIFT</key>+<key>TAB</key> keys to navigate expanded tabs and content.",
        condition: {navigateTabsByTabKey:false},
        sort:40,
      },
      navigateTabsAsCircularLoop :{
        content:    "Tabs may be navigated as a circular loop.",
        condition: {navigateTabsAsCircularLoop:true},
        sort:50,
      },
      expandTabOnMouseClick :{
        content:    "Expand tabs using the mouse click or <key>ENTER</key>/<key>RETURN</key> key.",
        condition: {tabsSelfClosable:false,expandPanelOnTabFocus:false},
        sort:60,
      },
      expandAndCloseTabOnMouseClick :{
        content:    "Expand and close tabs using the mouse click or <key>ENTER</key>/<key>RETURN</key> key.",
        condition: {tabsSelfClosable:true,expandPanelOnTabFocus:false},
        sort:70,
      },
      expandTabOnFocus :{
        content:    "Expand tabs upon focus or mouse click.",
        condition: {expandPanelOnTabFocus:true,tabsSelfClosable:false},
        sort:80,
      },
      expandAndCloseTabOnFocus :{
        content:    "Expand and close tabs upon focus or mouse click.",
        condition: {expandPanelOnTabFocus:true,tabsSelfClosable:true},
        sort:90,
      },
      tabsMultiSelectable :{
        content:    "Multiple tabs may be expanded at once.",
        condition: {tabsMultiSelectable:true},
        sort:100,
      },
    },
  },// end default defaults
  "tabsGrid" : {
    components:{
      tabList:{selectorDepth:3},
    },
     navigateTabGridByArrowKeys: true,        
  },// end tabsGrid defaults
  "accordion": {
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
  },// end accordio defaults
  "accordionGrid" : {
    tokens : ["accordion"],
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
  },
  "slider" : {
    navigateTabsAsCircularLoop: true, 
    effect: 'slide',
    effectOptions: {
          duration:200,
        },
    queueOpeningEffect: false,
  },
};



$.each($.uix.tabs.prototype.configurations["default"].components, function(key,obj){
  obj = $.extend(true, {}, $.uix.tabs.prototype.templates.componentSelector, obj);
  if(obj.classes){
    obj.classes = $.extend(true, {}, $.uix.tabs.prototype.templates.componentClasses, obj.classes);
  }
  $.uix.tabs.prototype.configurations["default"].components[key] = obj;
});


// $.widget( "uix.tabsGrid", $.uix.tabs, {
//   defaults : {
//     components:{
//       $tabList:{selectorDepth:3},
//     },
//      navigateTabGridByArrowKeys: true,        
//   },
// });
//     
// $.widget( "uix.accordion", $.uix.tabs, {
//   defaults: {
//     expandPanelOnTabFocus: false,
//     focusPanelOnTabExpand: true,
//     focusTabOnPanelBlur: true,
//     components:{
//       $tabList:{selectorDepth:0},
//     },
//      tabsSelfClosable: true,
//      effect: 'slide',
//      effectOptions: {duration:200},
//      queueOpeningEffect: false,
//   },
// });
// 
// $.widget( "uix.accordiongrid", $.uix.tabs,{
//   defaults : $.extend(true,{},$.uix.accordion.prototype.defaults,{
//     navigateTabGridByArrowKeys: true,
//     scrollOnOpen: true,
//     updateLocationHash: true,
//     effectOptions: {
//           duration:200,
//           step : function(now,fx){
//             if(fx.prop == 'height')
//             $(fx.elem).parent().css('padding-bottom',now+'px');
//           },
//         },
//     sync: function(tabgroup){
//         tabgroup.$panels.filter('[aria-hidden="false"]').each(function(){
//             var tabpanelHeight = $(this).height();
//             $(this).parent().css('padding-bottom',tabpanelHeight+'px');
//         });
//       },
//     syncInterval: 500,
//   }),
// });
// 
// $.widget( "uix.uixslider", $.uix.tabs,{
//   navigateTabsAsCircularLoop: true, 
//   effect: 'slide',
//   effectOptions: {
//         duration:200,
//       },
//   queueOpeningEffect: false,
// });


// 
// $.uix.createWidgetVariant = function(widgetName,variantName,options,components,helptext){
//   var variant = $.widget( "uix."+variantName, $.uix[widgetName],options);
//   $.widget.extend(variant.prototype.components,components);
//   $.widget.extend(variant.prototype.helptext,helptext);
//   $.fn[variantName] = function(instance,iOptions,iComponents,iHelptext){
//     $.uix._buildWidgetInstance = function(instance,1Options,iComponents,iHelptext);
//   }
// }
// $.uix._buildWidgetInstance = function(instance,options,components,helptext){
//   
// }

$.uix.tabs.prototype._getCreateOptions = function(){
  // console.log(this);
  // console.trace();
  // var _super = typeof(this._super) === 'function' ? this._super : function(){return{}};
  // return $.extend(true,{},_super(),this.defaults);
}

/**
 * In UIX widgets, `this.options` object is populated by `this._create()` funcition, 
 * instead of by `this._createWidget()` function as defined by jquery.ui.
 * This is because UIX widgets have additional functionalities that UI widgets do not, namely:
 *  -1 UIX widgets may be instantiated and have "instance options" set by special data attributes 
 *     on the target HTML element
 *  -2 UIX widgets may have "default" options set, in addition to the widget's "default" options, 
 *     by referencing any of the keys from `this.defaults` as an array of strings in `this.options.defaults`
 * These additional features mean that the strings in `this.options.defaults` must be resolved 
 * as `this.defaults` options and added as values to `this.options` before the latter is then 
 * extended by the "instance options". To to get the "instance options" from the HTML data attributes, 
 * UIX widgets use `this._getCreateOptions()` function, which is called by `this._createWidget()` 
 * right before calling `this._create()`. Therefore, at the time `this._create()` is called, 
 * `this.options` should only contain the "instance options", so that all "defaults" (including 
 * widget default defaults) can be resolved and then extended upon by `this.options`.
 *
 * @see `$.Widget.prototype._createWidget()` function in `/jquery-ui.js` 
 *      for how `this.options` object is instatiated initially. 
 */ 
$.uix.tabs.prototype._create = function() { 
  
  var instanceOptions = this.options;
  var defaultConfiguration = this.configurations["default"];
  var widgetConfiguration = $.uix.getWidgetConfiguration(this); // resolve this.options.tokens array of configuration keys
  this.options = $.extend(true,{},defaultConfiguration,widgetConfiguration);
  // using this.option() function allows instance options to be set using dot notation {"object.key":"value"}
  for(optionKey in instanceOptions){
    this.option(optionKey,instanceOptions[optionKey]);
  }
  
  // define the widget properties 
  if(this.options.tabDepth < 1)this.options.tabDepth = 1;
  if(this.options.tabPanelDepth < 1)this.options.tabPanelDepth = 1;

  // this.keys = new keyCodes(); // keycodes needed for event handlers 
  this.$tabList = this._createComponent('tabList');
  this.$tabListItems = this._createComponent('tabListItems');
  this.$tabs = this._createComponent('tabs');
  this.$panels = this._createComponent('panels');
  this.$next = this._createComponent('next');
  this.$previous = this._createComponent('previous');
  this.$helpRegion = this._createComponent('helpRegion');

  this.tabClick = false; // flag to track touch click events

  if(this.options.queueOpeningEffect) this.openingEffectTimer;

  // Bind event handlers 
  this._bindHandlers(); 

  // Initialize the tab panel 
  this._processComponents();

  // console.log('New $.uix.tabs :'); 
  // console.log(this); 

}

/**
 * _createComponent(selector)
 *
 * settings.components[key]
 * 
 * @returns a Component object with the following properties
 * .selector (string) :
 *    jQuery selector or key from this.options.components.
 *    if a key from this.options.elements is used, all other values for this init property will be inherited from that key's init property
 *    "" or NULL will result in "*" (default)
 *    all other strings will be treated as a jQuery selector
 *    the result will be a jQuery selector passed to either find() or filter() methods called on a jQuery object
 * .selectorContext (string) :
 *    jQuery selector or key from this.options.components.
 *    If there no elements are found using query.relatedby and query.relationship properties below...
 *    if a key from this.options.elements is used, the associated jQuery object will be referenced
 *    "" or NULL (default) will result in referencing the parent $tabSet jQuery object
 *    all other strings will be treated as selectors, from which a jQuery object will be built
 *    the resulting jQuery object will have filter() or find() called on it to obtain the desired elements
 * .selectorDepth (number) :
 *    If there no elements are found using query.relatedby and query.relationship properties below...
 *    0 will attempt to call filter() on the jQuery Object returned by query.selectorContext, using the unmodified query.selector as an argument. 
 *    all other values will result in find() being called on the jQuery object returned by query.selectorContext
 *    1 will prepend ">" to query.selector, selecting from the first level children. 
 *    any other number will prepend "> *" N times to query.selector, selecting from the specified level children. 
 *    NULL (default) will select from any level children.
 * .relationship (string) :
 *    may by the name of any HTML attribute whose allowed value is of the type "ID Reference List"
 *    this includes the following aria relationship attributes:
 *    "aria-describedby" "aria-controls","aria-flowto","aria-labelledby", "aria-owns"
 *    "" or NULL (default) will result in no action taken
 * .relatedBy (string) :
 *    jQuery selector or key from this.options.components.
 *    If query.relationship property is a valid attribute name, determine which element(s) the attribute will be found in...
 *    if a key from this.options.elements is used, the associated jQuery object will be referenced
 *    "" or NULL (default) will result in referencing the parent $tabSet jQuery object
 *    All other strings will be treated as selectors, from which a jQuery object will be built.
 *    Each element in this jQuery object will be querried for the attribute indicated by query.relationship
 *    If the attribute and values are found, then a new jQuery object will be made 
 *    by selecting all the element IDs found in the attributes' values
 *    This new jQuery object will then be filtered using the query.selector string above
 *    to determin the final collection of DOM elements
 */
$.uix.tabs.prototype._createComponent = function(key){
  // console.group('Calling _createComponent('+key+')')
  if (typeof key !== 'string' || this.options.components[key] === undefined){
    // console.error('provided argument is either not a string or not a key in options.components : ');
    // console.log(' argument : %s (%s)',key,typeof(key));
    // console.log(' components : %O',this.options.components);
    // console.groupEnd();
    return $();// TODO return error
  }
  var $components = $(),
      componentOptions = this.options.components[key],
      $selector,depth,depthString,$context;

  // console.log('componentOptions : ');
  // console.log(componentOptions);

  if(componentOptions.relationship !== undefined ){
    // console.group(' querying via relationship attributes');
    $selector = this.getComponent(componentOptions.selector, false);
    $context = this.getRelatedComponents(componentOptions.relatedby,componentOptions.relationship);
    // console.log($selector);
    // console.log($context);
    $components = $context.length > 0 ? $context.filter($selector) : $components;
    // console.log('  found '+$components.length+' components via relationship attributes');
    // console.groupEnd();
  }
  if(componentOptions.selector !== undefined && $components.length === 0){
    // console.group('  querying via selector and context');
    $selector = this.getComponent(componentOptions.selector, false);
    $context = this.getComponent(componentOptions.selectorContext);
    // console.log($selector);
    // console.log($context);
    depth = typeof componentOptions.selectorDepth === "number" ? componentOptions.selectorDepth : "";
    if(depth > 0 ){
      // componentOptions children at a specified depth
      // console.log('  querying children of "'+componentOptions.selectorContext+'" for "'+componentOptions.selector+'" at a depth of '+depth );
      depthString = '> ';
      for (var i = 1; i < depth; i++) {
        depthString = '> * '+depthString;
      }
      $components = 
        $selector instanceof jQuery ? 
        $context.find(depthString+'* ').filter($selector):
        $context.find(depthString+$selector);
    }
    if(depth === 0){
      // filter the context object
      // console.log('  filtering "'+componentOptions.selectorContext+'" for "'+componentOptions.selector+'"' );
      $components = $context.filter($selector);
    }
    else if(depth == null || depth == ""){
      // componentOptions all children
      // console.log(' querying all children of "'+componentOptions.selectorContext+'" for "'+componentOptions.selector+'"' );
      $components = $context.find($selector);
    }
    // console.log(' found '+$components.length+' components via selector and context.');
    // console.groupEnd();
  }
  // console.log('components : ');
  // console.log($components);
  // console.groupEnd();
  return $components;
}

$.uix.tabs.prototype._processComponents = function() { 
  var widget = this,
      expandedId =  widget.options.defaultExpandedId ? widget.options.defaultExpandedId : 
                    widget.options.getExpandedTabFromLocationHash ? window.location.hash.substring(1) : '',
      $expandedTab = $();
  // add aria attributes to the tabgroup container 
  widget.element.attr('aria-multiselectable', widget.options.tabsMultiSelectable); 

  // add aria attributes to the tablist
  widget.$tabList.attr('role', 'tablist', 'add'); 

  // add aria attributes to the panels and hide  them
  widget.$panels.uniqueId().attr('role', 'tabpanel', 'add').aria('hidden', 'true').hide().each(
    function(){
      // TODO if panel is not controlled by a tab then what to do?
      // do nothing, OR 
      // scan all tabs for the first missing controls attribute, OR
      // something else?
    }); 

  // add aria attributes to the tabs
  // for all tabs that control a panel...
  // swap tab href values for the aria-controls value
  //  (href value might be pointing to URL of remote content for graceful degradation)
  // set aria-expanded to false, if it's not already set
  // set initial tabindex 
  widget.$tabs.uniqueId().attr('role', 'tab', 'add').each(
    function(index,tab){
      var $tab = $(this),
          $tablist = widget.$tabList.has($tab);
      if($tablist.length === 0){
        // TODO which tablist should the tab be owned by
        // this is not a foolproof check for the closest tablist parent or aunt
        $tablist = $tab.closest(':has([role~="tablist"])').find('[role~="tablist"]').first();
        $tablist.aria('owns',$tab.id);
      }
      if($tab.aria('controls')){
        if($tab.attr('href')) $tab.attr('href','#'+$tab.aria('controls'));
        if($tab.aria('expanded') != 'true') $tab.aria('expanded','false');
        widget.setTabIndex($tab);
      }
    });
 
  // process next and previous buttons, if they exist
  if(widget.$next.length){
    widget.$next.click(function(event){
      var $currentTab = widget.getExpandedTabs();
      var $nextTab = widget.getNextTab($currentTab);
      console.group('Calling widget.$next.click() :');
      console.log('$currentTab : %O',$currentTab);
      console.log('$nextTab : %O',$nextTab);
      console.groupEnd();
      widget.switchTabs($currentTab,$nextTab);
      });
  }
  if(widget.$previous.length){
    widget.$previous.click(function(event){
      var $currentTab = widget.getExpandedTabs();
      var $previousTab = widget.getPreviousTab($currentTab);
      console.group('Calling widget.$previous.click() :');
      console.log('$currentTab : %O',$currentTab);
      console.log('$previousTab : %O',$previousTab);
      console.groupEnd();
      widget.switchTabs($currentTab,$previousTab);
      });
  }
  // if there is a tab to activate, 
  // set focus to it, expand it's panel, and set tabindex
  if(expandedId){
       $expandedTab = widget.$tabs.filter('#'+expandedId+',[aria-controls~='+expandedId+']')
    }
  if($expandedTab.length === 0){
       $expandedTab = widget.$tabs.filter('[aria-controls][aria-expanded="true"]')
    }
  if($expandedTab.length > 0){
    $expandedTab.first().click();
  }else{
    // otherwise, set the tabindex of the first tab
    widget.setTabIndex(widget.$tabs.eq(0), true);
  }

  // initialize sync function
  var syncFunction = widget.options.sync;
  if(typeof(syncFunction) == 'function' && widget.options.syncInterval > 0){
    setInterval(function(){ syncFunction(widget); },widget.options.syncInterval);
  }

  // initialize tab triggers that lie outside this widget
  this.initRemoteTabLinks();

} // end init() 

// initialize remote tab links 
$.uix.tabs.prototype.initRemoteTabLinks = function($element){
  if(!$element || $element.length > 0) var $element = $('body');
  var widget = this;
  $element.find($('a[role~="link"],a:not([role])')).each(function(){
    var $targetTab = widget.$tabs.filter('[aria-controls~="'+this.hash.substring(1)+'"]');
    if($targetTab.length){
      $(this).click(function(e){
        $targetTab.click()
        e.preventDefault();
      });
    }
  });
}



// 
// Function switchTabs() is a member function to give focus to a new tab or accordian header. 
// If it's a tab panel, the currently displayed panel is hidden and the panel associated with the new tab 
// is displayed. 
// 
// @param ($curTab obj) $curTab is the jQuery object of the currently active tab 
// 
// @param ($newTab obj) $newTab is the jQuery object of new tab to switch to 
// 
// @param (show boolean) activate is true if focus should be set on an element in the panel; false if on tab 
// 
// @return N/A 
// 
$.uix.tabs.prototype.switchTabs = function($curTab, $newTab, expand) { 
  // Set focus on new tab and make it navigable 
  $newTab.focus();
  // expand panel if requested
  if(expand != null){
    this.togglePanel($newTab,expand);
  }
  // unfocus curent tab and remove tabindex
  // must happen AFTER panel open/close operations
  $curTab.blur();
} // end switchTabs() 

// 
// Function togglePanel() is a member function to display or hide the panel 
// associated with an accordian header. Function also binds a keydown handler to the focusable items 
// in the panel when expanding and unbinds the handlers when collapsing. 
// 
// @param ($tab obj) $tab is the jQuery object of the currently active tab 
// 
// @param (action string) override default action for tab, depending on the string 
//                       possible values are ['focus','blur','show','hide'] 
//
// @return N/A 
// 
$.uix.tabs.prototype.togglePanel = function($tab,expand) { 
  console.group('Calling togglePanel($tab,expand):');
  if(this.$tabs.index($tab) === -1) return false;
  expand = expand == null ? null : expand ? true : false;
  console.log('$tab : %O',$tab);
  console.log('expand : ',expand);
  var widget = this;
  var $tabWrapper = this.$tabListItems.has($tab);
  var $panel = this.getTabPanel($tab); 
  var panelHidden = this.isPanelHidden($panel);
  var panelId = $panel.id;
  // var panelLoadUri = $panel.attr('data-load');
  // var effectOptions = $.extend(true, {}, this.options.effectOptions);
  // var openingDelay = 0;
  var panelsToClose = [];
  console.log('$tabWrapper : %O',$tabWrapper);
  console.log('$panel : %O',$panel);
  console.log('panelHidden : ',panelHidden);
  console.log('tabsSelfClosable : ',this.options.tabsSelfClosable);

  if(panelHidden == false && this.options.tabsSelfClosable == true && !expand){
     $panelsToClose = $panel;
     if(window.location.hash == '#'+panelId) this._clearLocationHash();
  }else if(panelHidden == true && this.options.tabsMultiSelectable == false){
     $panelsToClose = this.getExpandedPanels();
  }
  console.log('$panelsToClose : %O',$panelsToClose);

  if($panelsToClose.length > 0){ 
    if($panelsToClose.is($panel) && widget.options.scrollOnOpen){ 
      $.uix.scrollToElement($tabWrapper,false);
      $tab.focus(); //$panel.attr('aria-hidden', 'true').removeClass('active'); 
    }
    this.hidePanels($panelsToClose);
  }

  if(panelHidden == true || expand===true) { 

    if(this.isTabPanelLoaded($tab)) {
      this.showPanel($panel);
      // this.effectShow($panel,effectOptions,openingDelay);
    }else{
      this.loadAjaxPanelContent($panel);
    }
    //$panel.attr('aria-hidden', 'false').addClass('active'); 
    //$panel.slideDown(100); 
  }
  console.groupEnd();
} // end togglePanel() 

$.uix.tabs.prototype.showPanel = function($panel){
  var widget = this,
      $tab = this.getPanelTab($panel),
      effectOptions = $.extend(true, {}, this.options.effectOptions),
      // TODO should use animation API to check if closing animation is still running instead of guessing...
      openingDelay =  this.getExpandedPanels().length > 0 && 
                      widget.options.queueOpeningEffect === true ? 
                      effectOptions.duration || 400 : 0;

  effectOptions.complete = function(){
     var expandedTabClass = widget.options.components.tabs.classes.expanded || 'expanded';
     var expandedPanelClass = widget.options.components.panels.classes.expanded || 'expanded';
     if(widget.options.scrollOnOpen) $.uix.scrollToElement($panel,false);
     if(widget.options.updateLocationHash) window.location.hash = $panel.attr('id');
     $panel.attr('aria-hidden', 'false').addClass(expandedTabClass);
     $tab.attr('aria-expanded', 'true').attr('aria-selected', 'true').addClass(expandedPanelClass);//.attr('tabindex', '0'); 
     //if(widget.options.focusPanelOnTabExpand) $panel.find(':focusable').first().focus();
    if(widget.options.focusPanelOnTabExpand) {
      widget.setTabIndex($panel,0);
      $($panel).focus();
    }
   };
  this.effectShow($panel,effectOptions,openingDelay);
}

$.uix.tabs.prototype.hidePanels = function($panels){
  var widget = this;
  var effectOptions = $.extend(true, {}, this.options.effectOptions);
  if(widget.options.focusPanelOnTabExpand) {
    $($panels).blur();
    widget.setTabIndex($panels,-1);
  }
  effectOptions.complete = function(){
      var $thisPanel = $(this);
      var $thisPanelTab = widget.getPanelTab($thisPanel);
      var expandedTabClass = widget.options.components.tabs.classes.expanded || 'expanded';
      var expandedPanelClass = widget.options.components.panels.classes.expanded || 'expanded';
      $thisPanel.attr('aria-hidden', 'true').removeClass(expandedPanelClass);
      $thisPanelTab.attr('aria-expanded', 'false').attr('aria-selected', 'false').removeClass(expandedTabClass);//.attr('tabindex', '-1'); 
    };
  this.effectHide($panels,effectOptions);
}

$.uix.tabs.prototype.loadAjaxPanelContent = function( $panel, event ) {
  // console.group('Calling tabs.loadAjaxPanelContent($tab, event)');
  //if(this.$tabs.())
  var that = this,
    // anchor = this.getTabAnchor($tab),
    $tab = this.getPanelTab($panel),
    url = this.getAjaxPanelContentUrl($panel),
    selector = this.getAjaxPanelContentSelector($panel),
    eventData = {
      '$tab': $tab,
      '$panel': $panel,
    },
    content= '';
  // console.log('url : %s',url);
  // console.log('$panel : %O',$panel);
  // console.log('eventData : %O',eventData);
  this.xhr = $.ajax( this._ajaxSettings( url, event, eventData ) );

  // support: jQuery <1.8
  // jQuery <1.8 returns false if the request is canceled in beforeSend,
  // but as of 1.8, $.ajax() always returns a jqXHR object.
  if ( this.xhr && this.xhr.statusText !== "canceled" ) {
    $tab.attr( "aria-busy", "true" );
    $panel.attr( "aria-busy", "true" );

    this.xhr
      .success(function( response ) {
        // support: jQuery <1.8
        // http://bugs.jquery.com/ticket/11778
        setTimeout(function() {
          content = selector ? $(selector,response) : response;
          $panel.append( content );
          that._trigger( "ajaxPanelContentLoaded", event, eventData );
          that.showPanel($panel);
          that.initRemoteTabLinks($panel);
        }, 1 );
      })
      .complete(function( jqXHR, status ) {
        // support: jQuery <1.8
        // http://bugs.jquery.com/ticket/11778
        setTimeout(function() {
          if ( status === "abort" ) {
            that.$panels.stop( false, true );
          }

          $tab.removeAttr( "aria-busy" );
          $panel.removeAttr( "aria-busy" );

          if ( jqXHR === that.xhr ) {
            delete that.xhr;
          }
        }, 1 );
      });
  }
  // console.groupEnd();
}

$.uix.tabs.prototype._ajaxSettings = function( url, event, eventData ) {
  var that = this;
  return {
    'url': url,
    beforeSend: function( jqXHR, settings ) {
      return that._trigger( "beforeLoad", event,
        $.extend( { jqXHR: jqXHR, ajaxSettings: settings }, eventData ) );
    }
  };
}

// define effects to be called for hiding and showing the panels
$.uix.tabs.prototype.effectFunction = function(show){
  show = show == null ? null : show ? true : false;
  switch(this.options.effect){
    case 'fade' : 
        if(show === true) return 'fadeIn';
        if(show === false)  return 'fadeOut';
        return 'fadeToggle';
    case 'slide' : 
      if(show === true) return 'slideDown';
      if(show === false) return 'slideUp';
      return 'slideToggle';
    case 'none' : 
    default:
      if(show === true) return 'show';
      if(show === false) return 'hide';
      return 'toggle';
  }
}

    $.uix.tabs.prototype.effectFunctionCall = function(show,$element,effectOptions,delayEffect){
      var effectFunction = this.effectFunction(show);
      if($element instanceof jQuery != true) return false;
      effectOptions = effectOptions == {} ? null : effectOptions;
      delayEffect = $.isNumeric(delayEffect) ? Number(delayEffect) : false;
      if(delayEffect){ 
        //if(this.options.tabsMultiSelectable == false) clearTimeout(this.openingEffectTimer);
        this.openingEffectTimer = setTimeout(function(){
              $element[effectFunction](effectOptions);
            },delayEffect);
      }else{
        return $element[effectFunction](effectOptions);
      }
    }
    // use effect from settings to hide or show the panels
    $.uix.tabs.prototype.effectHide = function($element,effectOptions,delayEffect){
      return this.effectFunctionCall(false,$element,effectOptions,delayEffect);
    }
    $.uix.tabs.prototype.effectShow = function($element,effectOptions,delayEffect){
      return this.effectFunctionCall(true,$element,effectOptions,delayEffect);
    }
    $.uix.tabs.prototype.effectToggle = function($element,effectOptions,delayEffect){
      return this.effectFunctionCall(null,$element,effectOptions,delayEffect);
    }

    $.uix.tabs.prototype.hasTabPanel = function($tab){
      return $tab.attr('aria-controls') != '' ? true : false;
    }
    $.uix.tabs.prototype.getPanelTab = function($panel){
      return this.$tabs.filter('[aria-controls~="'+$panel.attr('id')+'"]');
    }
    $.uix.tabs.prototype.getExpandedPanels = function(){
      return this.$panels.filter('[aria-hidden="false"]');
    }
    $.uix.tabs.prototype.getTabPanel = function($tab){
      return this.$panels.filter('#'+$tab.attr('aria-controls'));
    }
    $.uix.tabs.prototype.getExpandedTabs = function(){
      return this.$tabs.filter('[aria-expanded="true"]');
    }
    $.uix.tabs.prototype.setTabIndex = function($element,tabindex){
      tabindex = tabindex >= 0 ? tabindex :
                 tabindex === true ? 0 :
                 this.$tabs.has($element) && this.options.navigateBytabKey || this.isTabExpanded($element) ? 0 : 
                 -1;
      $element.tabIndex = tabindex;
      return this;
    }
    $.uix.tabs.prototype.getTabAnchor = function($tab){
      return $tab.is('a') ? $tab.first() : $tab.find('a').first();
    }
    $.uix.tabs.prototype.getAjaxPanelContentUrl = function($panel){
      var attributeName = this.options.components.panels.ajax.urlAttributeName;
      return  $panel.attr(attributeName) || 
              this.getPanelTab($panel).attr(attributeName);
    }
    $.uix.tabs.prototype.getAjaxPanelContentSelector = function($panel){
      var attributeName = this.options.components.panels.ajax.selectorAttributeName;
      return  $panel.attr(attributeName) || 
              this.getPanelTab($panel).attr(attributeName);
    }
    $.uix.tabs.prototype.isTabExpanded = function($tab){
      $tab = $tab instanceof jQuery ? $tab : $($tab);
      return $tab.attr('aria-expanded') == 'true' ? true : false;
    }
    $.uix.tabs.prototype.isPanelHidden = function($panel){
      $panel = $panel instanceof jQuery ? $panel : $($panel);
      return $panel.attr('aria-hidden') == 'true' ? true : false;
    }
    $.uix.tabs.prototype.isTabPanelLoaded = function($tab){
      var $panel = this.getTabPanel($tab);
      var hasAjaxUrl = this.getAjaxPanelContentUrl($panel) ? true : false;
      var isTabPanelLoaded = 
          //$.uix._isLocalHref( this.getTabAnchor($tab).normalHref() ) === false &&
          hasAjaxUrl && ($tab.attr('aria-busy') || $panel.attr('aria-busy')) ? false : true;
      // console.log('Calling isTabPanelLoaded() : %s',isTabPanelLoaded )
      return isTabPanelLoaded;
    }
    $.uix.tabs.prototype.getPreviousTab = function($tab){
      var index = this.$tabs.index($tab);
      index = index < 0 ? 0 : index;
      if(this.options.navigateTabsAsCircularLoop){
        index = index == 0 ? -1 : index -1;   
      }else{
        index = index == 0 ? 0 : index -1;
      }
      return this.$tabs.eq(index);
    }
    $.uix.tabs.prototype.getNextTab = function($tab){
      var end = this.$tabs.length -1;
      var index = this.$tabs.index($tab);
      index = index < 0 ? 0 : index;
      if(this.options.navigateTabsAsCircularLoop){
        index = index == end ? 0 : index +1;    
      }else{
        index = index == end ? end : index +1;
      }
      return this.$tabs.eq(index);
    }
    $.uix.tabs.prototype.isATab = function($tab){
      var index = this.$tabs.index($tab);
      return index > -1 ? true : false;
    }

    $.uix.tabs.prototype.isFirstTab = function($tab){
      var index = this.$tabs.index($tab);
      return index === 0 ? true : false;
    }

    $.uix.tabs.prototype.isLastTab = function($tab){
      var end = this.$tabs.length -1;
      var index = this.$tabs.index($tab);
      return index === end ? true : false
    }

    // return the $tab in the next or previous direction (same column) in a grid tab layout
    $.uix.tabs.prototype.getNextVerticalTab = function($tab,direction) {
      if($tab instanceof jQuery === false) return;
      direction =  direction === true  || direction === 1 || direction === 'down' ? 1 : 
             direction === false  || direction === -1 || direction === 'up' ? -1 :
             0;
      var widget = this,
          $tabWrapper = $tab.closest(widget.$tabListItems),
          tabOffset, tabPrevRowOffset, $newTab;
      if($tabWrapper.length){
        tabOffset = $tabWrapper.offset();
        tabPrevRowOffset = tabOffset.top + (direction * $tabWrapper.outerHeight(true));
        $newTab = widget.$tabs.filter(
          function(index, thisTab){
            var thisTabOffset = $(thisTab).closest(widget.$tabListItems).offset();
            if(thisTabOffset.top == tabPrevRowOffset && thisTabOffset.left == tabOffset.left) {
              return true;
            }
          });
      }
      return $newTab;
    }

    /**
     * getRelatedComponents(relatedby,relationship)
     *
     * query the DOM to find 'related' elements from the content's of an element's 'relationship' attribute
     * 
     * @param relatedby (string,jQuery) a widgetKey, jQuery selector, or jQuery object on which a relationship attribute is present.
     * @param relationship (string) the name of the attribute which contains a single or list of element IDs
     * @returns (jQuery) a list of elements found to be 'related'
     */
    $.uix.tabs.prototype.getRelatedComponents = function(relatedby,relationship){
      // console.log('Calling getRelatedComponents("'+relatedby+'", "'+relationship+'")');
      if( relatedby != null && 
          typeof relatedby !== 'string' && 
          relatedby instanceof jQuery === false) {
        return; // TODO generate error
      }
      if(typeof relationship !== 'string' ) {
        return; // TODO generate error
      }
      var $relatedby = relatedby instanceof jQuery ? relatedby : this.getComponent(relatedby);
      var $related = $();
      var attrValue = "";
      var attrSplit = [];
      // console.log('  getRelatedComponents() found  '+$relatedby.length+' elements to check for relationship attribute');
      $relatedby.each(function(){
        attrValue = $(this).attr(relationship);
        if(typeof attrValue !== 'string' || attrValue === ""){
          return; // TODO generate notice
        }
        attrSplit = attrValue.indexOf(', ') > -1 ? attrValue.split(', ') : 
                    attrValue.indexOf(',') > -1 ? attrValue.split(',') :
                    attrValue.split(' ') ;
        // console.log('$relatedby : found '+attrSplit.length+' element IDs in "['+relationship+']"');
        for(index in attrSplit){
          // console.log('  getRelatedComponents() adding "#'+attrSplit[index]+'" to $related');
          $related = $related.add('#'+attrSplit[index]);
        }
      });
      // console.log('  getRelatedComponents() found '+$related.length+' related elements');
      return $related;
    }

    /**
     * getComponent(key,callJQuery)
     *
     */
    $.uix.tabs.prototype.getComponent = function(key,asJQuery){
      asJQuery = asJQuery === false ? false : true ;
      if(key == null || key == "" || typeof key !== 'string'){
        return asJQuery ?  this.element : "";
      }
      if(this[key] !== undefined && this[key] instanceof jQuery){
        return this[key];
      }
      if(this.options.components[key] !== undefined){
        return this._createComponent(key);
      }
      return asJQuery ? $(key,this.element) : key;
    }

    // 
    // Function _bindHandlers() is a member function to bind event handlers for the tabs 
    // 
    // @return N/A 
    // 
    $.uix.tabs.prototype._bindHandlers = function() { 

      var widget = this; // Store the this pointer for reference 

      ////////////////////////////// 
      // Bind handlers for the tabs / accordian headers 

      // bind a tab keydown handler 
      this.$tabs.keydown(function(e) { 
        return widget._handleTabKeyDown($(this), e); 
      }); 

      // bind a tab keypress handler 
      this.$tabs.keypress(function(e) { 
        return widget._handleTabKeyPress($(this), e); 
      }); 

      // bind a tab click handler 
      this.$tabs.on('click touchstart touchmove touchend',function(e) { 
        switch(e.type){
          case 'touchstart':
            widget.tabClick = true;
            return;
          case 'touchmove':
            widget.tabClick = false;
            return;
          case 'click':
            widget.tabClick = true;     
        }
        if(widget.tabClick == true){
          widget.tabClick = false;
          return widget._handleTabClick($(this), e); 
        }
      }); 

      // bind a tab focus handler 
      this.$tabs.focus(function(e) { 
        return widget._handleTabFocus($(this), e); 
      }); 

      // bind a tab blur handler 
      this.$tabs.blur(function(e) { 
        return widget._handleTabFocus($(this), e); 
      }); 

      ///////////////////////////// 
      // Bind handlers for the panels 

      // bind a keydown handlers for the panel focusable elements 
      this.$panels.keydown(function(e) { 
        return widget._handlePanelKeyDown($(this), e); 
      }); 

      // bind a keypress handler for the panel 
      this.$panels.keypress(function(e) { 
        return widget._handlePanelKeyPress($(this), e); 
      }); 

      // bind a focus handler for the panel 
      this.$panels.focus(function(e) { 
        return widget._handlePanelFocus($(this), e); 
      });
      this.$panels.blur(function(e) { 
        return widget.getPanelTab($(this)).focus(); 
      }); 

    } // end _bindHandlers() 


    // 
    // Function _handleTabKeyDown() is a member function to process keydown events for a tab 
    // 
    // @param ($tab obj) $tab is the jquery object of the tab being processed 
    // 
    // @paran (e obj) e is the associated event object 
    // 
    // @return (boolean) Returns true if propagating; false if consuming event 
    // 
    $.uix.tabs.prototype._handleTabKeyDown = function($tab, e) { 
      console.group('Calling _handleTabKeyDown($tab,event)');
      console.log('$tab : %O',$tab);
      console.log('event : %O',e);
      console.groupEnd();
      if (e.altKey) { 
        // do nothing 
        return true; 
      } 

      var keyCode = e.keyCode;
      var tabExpanded = this.isTabExpanded($tab);

      // 'tab' keypress should act just the same as arrow keys, if tab is closed and navigateTabsByTabKey is true
      // TODO handle case where navigateTabsByTabKey is true and last or first tab has focus
      if (keyCode == $.ui.keyCode.TAB && this.options.navigateTabsByTabKey === true && tabExpanded != true) {
          if(e.shiftKey){ 
            keyCode = $.ui.keyCode.LEFT; 
          }
          else{ 
            keyCode = $.ui.keyCode.RIGHT; 
          }
        }

      switch (keyCode) { 
        case $.ui.keyCode.ENTER: 
        case $.ui.keyCode.SPACE: { 
          // only consume 'enter' or 'space' keypress if $tab has an 'aria-controls' attribute
          // because we want to allow regular links to be included in the tab navigation
          if(!this.hasTabPanel($tab)) {
            return true;
          } 
          // toggle the panel if it has not been toggled on focus
          if (!tabExpanded || tabExpanded && this.options.tabsSelfClosable) { 
            this.togglePanel($tab); 
          }
          // set focus on panel if it is now open
          if (this.isTabExpanded($tab)){
            //this.$panels.filter('#'+$tab.attr('aria-controls')).find(':focusable').first().focus();
            this._handlePanelFocus(this.getTabPanel($tab),e,0);
          }
          e.stopPropagation(); 
          return false; 
        } 

        case $.ui.keyCode.TAB: {
          // only consume 'tab' keypress if $tab panel is open, and then only if a focausable element lies within
          if(tabExpanded == true){
            //this.$panels.filter('#'+$tab.attr('aria-controls')).find(':focusable').first().focus();
            $tab = e.shiftKey ? this.getPreviousTab($tab) : $tab;
            return this._handlePanelFocus(this.getTabPanel($tab),e);
          }
          return true;
        }

        case $.ui.keyCode.LEFT: 
        case $.ui.keyCode.UP: { 

          // var widget = this; 
          var $prevTab; // holds jQuery object of tab from previous pass 
          var $newTab; // the new tab to switch to 

          if (e.ctrlKey) { 
            // Ctrl+arrow moves focus from panel content to the open 
            // tab/accordian header. 
          }
          else { 
           // use arrow keys to navigate "up" and "down" rows in a grid tab layout
            if(this.options.navigateTabGridByArrowKeys == true && keyCode == $.ui.keyCode.UP){
              $newTab = this.getNextVerticalTab($tab,'up');
            }
            if(!$newTab || !$newTab.length){       
              var curNdx = this.$tabs.index($tab); 

              if (curNdx == 0 && this.options.navigateTabsAsCircularLoop == true) { 
                // tab is the first one: 
                // set newTab to last tab 
                $newTab = this.$tabs.last(); 
              } 
              else { 
                // set newTab to previous 
                $newTab = this.$tabs.eq(curNdx - 1); 
              }
            } 
            // switch to the new tab 
            if($newTab.length) this.switchTabs($tab, $newTab);
            e.stopPropagation(); 
            return false;
          } 
        } 
        case $.ui.keyCode.RIGHT: 
        case $.ui.keyCode.DOWN: { 

          // var widget = this; 
          var foundTab = false; // set to true when current tab found in array 
          var $newTab; // the new tab to switch to 

          if (e.ctrlKey) { 
            // Ctrl+arrow
          }
          else{
            // use arrow keys to navigate "up" and "down" rows in a grid tab layout
            if(this.options.navigateTabGridByArrowKeys == true && keyCode == $.ui.keyCode.DOWN){
              $newTab = this.getNextVerticalTab($tab,'down');
            }
            if(!$newTab || !$newTab.length){
              var curNdx = this.$tabs.index($tab); 

              if (curNdx == this.$tabs.last().index() && this.options.navigateTabsAsCircularLoop == true) { 
                // tab is the last one: 
                // set newTab to first tab 
                $newTab = this.$tabs.first(); 
              } 
              else { 
                // set newTab to next tab 
                $newTab = this.$tabs.eq(curNdx + 1); 
              }
            } 
            // switch to the new tab 
            if($newTab.length)this.switchTabs($tab, $newTab);
            e.stopPropagation(); 
            return false;
          }
        } 
        case $.ui.keyCode.HOME: { 

          // switch to the first tab 
          this.switchTabs($tab, this.$tabs.first()); 

          e.stopPropagation(); 
          return false; 
        } 
        case $.ui.keyCode.END: { 

          // switch to the last tab 
          this.switchTabs($tab, this.$tabs.last()); 

          e.stopPropagation(); 
          return false; 
        } 
        case $.ui.keyCode.ESCAPE:{
          return true; 
        }
      } 
    } // end _handleTabKeyDown() 

    // 
    // Function _handleTabKeyPress() is a member function to process keypress events for a tab. 
    // 
    // 
    // @param ($tab obj) $tab is the jquery object of the tab being processed 
    // 
    // @paran (e obj) e is the associated event object 
    // 
    // @return (boolean) Returns true if propagating; false if consuming event 
    // 
    $.uix.tabs.prototype._handleTabKeyPress = function($tab, e) { 

      if (e.altKey) { 
        // do nothing 
        return true; 
      } 

      switch (e.keyCode) { 
        case $.ui.keyCode.ENTER: 
        case $.ui.keyCode.SPACE: 
          if(!this.hasTabPanel($tab)) return true;
        case $.ui.keyCode.LEFT: 
        case $.ui.keyCode.UP: 
        case $.ui.keyCode.RIGHT: 
        case $.ui.keyCode.DOWN: 
        case $.ui.keyCode.HOME: 
        case $.ui.keyCode.END: { 
          e.stopPropagation(); 
          return false; 
        } 
        case $.ui.keyCode.PAGE_UP: 
        case $.ui.keyCode.PAGE_DOWN: { 

          // The tab keypress handler must consume pageup and pagedown 
          // keypresses to prevent Firefox from switching tabs 
          // on ctrl+pageup and ctrl+pagedown 

          if (!e.ctrlKey) { 
            return true; 
          } 

          e.stopPropagation(); 
          return false; 
        } 
      } 

      return true; 

    } // end _handleTabKeyPress() 

    // 
    // Function _handleTabClick() is a member function to process click events for tabs 
    // 
    // @param ($tab object) $tab is the jQuery object of the tab being processed 
    // 
    // @paran (e object) e is the associated event object 
    // 
    // @return (boolean) returns true 
    // 
    $.uix.tabs.prototype._handleTabClick = function($tab, e) { 
      console.group('Calling _handleTabClick($tab,event)');
      console.log('$tab : %O',$tab);
      console.log('event : %O',e);
      console.groupEnd();

      // remove all tabs from the tab order 
      //this.$tabs.attr('tabindex', '-1'); 

      // make clicked tab navigable 
      //$tab.attr('tabindex', '0'); 

      if(!this.hasTabPanel($tab)) return true;

      // Expand the new panel 
      this.togglePanel($tab); 

      e.stopPropagation(); 
      return false; 

    } // end _handleTabClick() 


    // 
    // Function _handleTabFocus() is a member function to process focus and blur events for tabs 
    // 
    // @param ($tab object) $tab is the jQuery object of the tab being processed 
    // 
    // @paran (e object) e is the associated event object 
    // 
    // @return (boolean) returns true 
    //
    $.uix.tabs.prototype._handleTabFocus = function($tab,e,focus){
      focus = focus ? true :
              focus != null ? false :
              e == null || e.type == null ? null : 
              e.type === 'focus' ? true : 
              e.type === 'blur' ? false:
              e.keyCode && e.shiftKey ? false:
              e.keyCode ? true:
              null;
      // set focus class
      if(focus !== null){
        $tab.toggleClass('focus', focus);
      }
      // modify tabindex if tab key is not used for navigation and new focus target is also a tab
      if(this.options.navigateTabsByTabKey === false &&(
          focus === true ||
          (focus === false && this.isATab(e.relatedTarget) === true)
          )){
        this.setTabIndex($tab, focus);
        // console.log('_handleTabFocus($tab, e,focus)');
        // console.log(e);
        // console.log($tab);
        // console.log(focus);
      }

      // show or hide the panel
      if(focus && this.options.expandPanelOnTabFocus){
        this.togglePanel($tab,true);
      } 

      return this;
    }


    ///////////////////////////////////////////////////////// 
    // Panel Event handlers 
    // 

    // 
    // Function _handlePanelKeyDown() is a member function to process keydown events for a panel 
    // 
    // @param ($panel obj) $panel is the jquery object of the panel being processed 
    // 
    // @paran (e obj) e is the associated event object 
    // 
    // @return (boolean) Returns true if propagating; false if consuming event 
    // 
    $.uix.tabs.prototype._handlePanelKeyDown = function($panel, e) { 
      if (e.altKey) { 
        // do nothing 
        return true; 
      } 

      // get the jQuery object of the tab 
      var $tab = this.getPanelTab($panel); 

      switch (e.keyCode) { 
        case $.ui.keyCode.TAB: { 
          return this._handlePanelFocus($panel,e);
        } 
        case $.ui.keyCode.LEFT: 
        case $.ui.keyCode.UP: { 

          if (!e.ctrlKey) { 
            // do not process 
            return true; 
          } 

          // Move focus to the tab 
          $tab.focus(); 

          e.stopPropagation(); 
          return false; 
        } 
        case $.ui.keyCode.PAGE_UP: { 

          var $newTab; 

          if (!e.ctrlKey) { 
            // do not process 
            return true; 
          } 

          // get the index of the tab in the tab list 
          var curNdx = this.$tabs.index($tab); 

          if (curNdx == 0) { 
            // this is the first tab, set focus on the last one 
            $newTab = this.$tabs.last(); 
          } 
          else { 
            // set focus on the previous tab 
            $newTab = this.$tabs.eq(curNdx - 1); 
          } 

          // switch to the new tab 
          this.switchTabs($tab, $newTab); 

          e.stopPropagation(); 
          e.preventDefault(); 
          return false; 
        } 
        case $.ui.keyCode.PAGE_DOWN: { 

          var $newTab; 

          if (!e.ctrlKey) { 
            // do not process 
            return true; 
          } 

          // get the index of the tab in the tab list 
          var curNdx = this.$tabs.index($tab); 

          if (curNdx == this.$tabs.last().index()) { 
            // this is the last tab, set focus on the first one 
            $newTab = this.$tabs.first(); 
          } 
          else { 
            // set focus on the next tab 
            $newTab = this.$tabs.eq(curNdx + 1); 
          } 

          // switch to the new tab 
          this.switchTabs($tab, $newTab); 

          e.stopPropagation(); 
          e.preventDefault(); 
          return false; 
        } 
        case $.ui.keyCode.ESCAPE:{
          $tab.focus();
        }
      } 

      return true; 

    } // end _handlePanelKeyDown() 

    // 
    // Function _handlePanelKeyPress() is a member function to process keypress events for a panel 
    // 
    // @param ($panel obj) $panel is the jquery object of the panel being processed 
    // 
    // @paran (e obj) e is the associated event object 
    // 
    // @return (boolean) Returns true if propagating; false if consuming event 
    // 
    $.uix.tabs.prototype._handlePanelKeyPress = function($panel, e) { 

      if (e.altKey) { 
        // do nothing 
        return true; 
      } 

      if (e.ctrlKey && (e.keyCode == $.ui.keyCode.PAGE_UP || e.keyCode == $.ui.keyCode.PAGE_DOWN)) { 
          e.stopPropagation(); 
          e.preventDefault(); 
          return false; 
      } 

      switch (e.keyCode) { 
        case $.ui.keyCode.ESCAPE: { 
          e.stopPropagation(); 
          e.preventDefault(); 
          return false; 
        } 
      } 

      return true; 

    } // end _handlePanelKeyPress() 




    // 
    // Function _handlePanelFocus() is a member function to process focus or keyboard events
    // determine where focus should land when sent to a panel.
    // 
    // @param ($panel obj) $panel is the jquery object of the panel being processed 
    // @paran (e obj) e is the associated event object 
    // @param (increment boolean) the direction of focus change. "true" will move focus forward. "false" will move the focus backward. "null" will not move focus;
    // @param (increment number) the direction of focus change. "1" will move focus forward. "-1" will move the focus backward. "0" will not move focus;
    // 
    // @return (boolean) Returns true if propagating; false if consuming event 
    //
    $.uix.tabs.prototype._handlePanelFocus = function(panel, e, shift){
        $panel = $(panel);
        $eventTarget = $(e.target);
        shift = shift === null || shift === 0 || shift === 'none' ? 0 :
                shift === false || shift < 0 || shift === 'prev' ? -1 :
                shift === true || shift > 1 || shift === 'next' ? 1 :
                shift === undefined && e.keyCode == null ? 0 :
                shift === undefined && e.keyCode && e.shiftKey ? -1 :
                1;
        var panelNdx,numPanels,$newTarget,
            $focusable = $panel.find(':focusable'),
            curNdx = $focusable.index($eventTarget); 
        // if current focus is outside the panel, 
        // assume it is the first focusable item in the panel if shift is set to none
        curNdx = shift === 0 && $focusable.length && curNdx === -1 ? 0 : curNdx;

        // if there is a focusable item in the panel then go to it
        // unless the current focus is on the first (or last) item in the panel and shift is -1 (or 1)
        if ($focusable.length && (
            (shift === 0) || 
            (shift === -1 && curNdx > 0) || 
            (shift === 1 && curNdx < $focusable.length -1)
            )) {
          $newTarget = $focusable.eq(curNdx + shift);
          // console.log(' - focus on item in panel (#'+$newTarget.attr('id')+')');
        }
        // otherwise send focus to outside this panel
        else {
          panelNdx = this.$panels.index($panel); 
          numPanels = this.$panels.length;
          // if the focusTabOnPanelBlur setting is set to true AND ... 
          //  if current focus is on the first (or last) item in the panel and shift is -1 (or 1)
          //  or if current focus is outside the panel and shift is 0 or 1 and there is nothing to focus on in the panel
          // THEN send focus to the parent tab.
          if(this.options.focusTabOnPanelBlur &&
              (shift === -1 && curNdx === 0) ||
              (shift ===  1 && curNdx > 0 && curNdx === $focusable.length -1) ||
              (shift === 0 && !$focusable.length)
            ){
            $panel = shift === 1 && curNdx > 0 ? this.$panels.eq(panelNdx + shift) :  $panel;
            $newTarget = this.getPanelTab($panel);
          }
          // otherwise, 
          // if this is the last (or first) panel, 
          // go to next (or previous) focusable item outside the tabset.
          else if(
            (shift == 1 && panelNdx == numPanels -1) || 
            (shift == -1 && panelNdx == 0) 
            ){
            // console.log(' -  send focus outside this tabgroup');
            return true;
          // otherwise 
          // call this method for the next (or previous) panel to find other focusable items
          }else{
            $panel = this.$panels.eq(panelNdx + shift);
            // console.log(' - send focus to another panel (#'+$panel.attr('id')+')');
            return this._handlePanelFocus($panel,event,shift);
          }
        }

        $newTarget.focus();
        e.stopPropagation(); 
        return false;
    }


    // remove location.hash without scrolling page to top
    // http://stackoverflow.com/a/5298684
    $.uix.tabs.prototype._clearLocationHash = function() { 
        var scrollV, scrollH, loc = window.location;
        if ("pushState" in history)
            history.pushState("", document.title, loc.pathname + loc.search);
        else {
            // Prevent scrolling by storing the page's current scroll offset
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;

            loc.hash = "";

            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
        }
    }

}(jQuery))