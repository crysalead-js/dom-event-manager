var event = require("./event");

var isArray = Array.isArray;

var capturable = {
  'blur': true,
  'focus': true,
  'mouseenter': true,
  'mouseleave': true
};

/**
 * Captures all event on at a top level container (`document.body` by default).
 * When an event occurs, the delegate handler is executed starting form `event.target` up
 * to the defined container.
 *
 * @param Function delegateHandler The event handler function to execute on triggered events.
 * @param Object   container       A DOM element container.
 */
function EventManager(delegateHandler, container) {
  if (typeof(delegateHandler) !== "function") {
    throw new Error("The passed handler function is invalid");
  }
  this._delegateHandler = delegateHandler;
  this._container = container || document;
  this._events = Object.create(null);
  this._map = {};
}

/**
 * Binds a event.
 *
 * @param String name The event name to catch.
 */
EventManager.prototype.bind = function(name) {

  var bubbleEvent = function(e) {
    e.isPropagationStopped = false;
    e.delegateTarget = e.target;
    e.stopPropagation = function() {
      this.isPropagationStopped = true;
    }
    while(e.delegateTarget !== null && e.delegateTarget !== this._container.parentNode) {
      this._delegateHandler(name, e);
      this._runHandlers(name, e);
      if (e.isPropagationStopped) {
        break;
      }
      e.delegateTarget = e.delegateTarget.parentNode;
    }
  }.bind(this);

  if (this._events[name]) {
    this.unbind(name);
  }
  this._events[name] = bubbleEvent;
  event.bind(this._container, name, bubbleEvent, capturable[name] !== undefined);
};

/**
 * Unbinds an event or all events if `name` is not provided.
 *
 * @param String name The event name to uncatch or none to unbind all events.
 */
EventManager.prototype.unbind = function(name) {
  if (arguments.length) {
    if (this._events[name]) {
      event.unbind(this._container, name, this._events[name], capturable[name] !== undefined);
    }
    return;
  }
  for (var key in this._events) {
    this.unbind(key);
  }
};

/**
 * Returns all binded events.
 *
 * @return Array All binded events.
 */
EventManager.prototype.binded = function() {
  return Object.keys(this._events);
}

/**
 * Binds some default events.
 */
EventManager.prototype.bindDefaultEvents = function() {
  for (var i = 0, len = EventManager.events.length; i < len; i++) {
    this.bind(EventManager.events[i]);
  }
};

/**
 * Listen an event.
 *
 * @param String name    The event name listen.
 * @param Object element The DOM element.
 * @param String handler The handler.
 */
EventManager.prototype.on = function(event, element, handler) {
  if (!this._map[event]) {
    this._map[event] = new Map();
  }
  if (!this._map[event].has(element)) {
    this._map[event].set(element, new Map());
  }
  this._map[event].get(element).set(handler, true);
};


/**
 * Unlisten an event.
 *
 * @param String name    The event name listen.
 * @param Object element The DOM element.
 * @param String handler The handler.
 */
EventManager.prototype.off = function(event, element, handler) {
  if (!this._map[event]) {
    return;
  }
  if (arguments.length === 1) {
    delete this._map[event];
    return;
  }
  if (!this._map[event].has(element)) {
    return;
  }
  if (arguments.length === 2) {
    this._map[event].delete(element);
    return;
  }
  var handlersMap = this._map[event].get(element);
  if (!handlersMap.has(handler)) {
    return;
  }
  handlersMap.delete(handler);
};

/**
 * Unlisten an event.
 *
 * @param String name    The event name listen.
 * @param Object element The DOM element.
 * @param String handler The handler.
 */
EventManager.prototype._runHandlers = function(name, e) {
  if (!this._map[name]) {
    return;
  }
  if (!this._map[name].has(e.delegateTarget)) {
    return;
  }
  this._map[name].get(e.delegateTarget).forEach(function(value, handler) {
    handler(e);
  });
}

/**
 * List of events.
 */
EventManager.events = [
  'abort',
  'animationstart',
  'animationiteration',
  'animationend',
  'auxclick',
  'blur',
  'canplay',
  'canplaythrough',
  'change',
  'click',
  'contextmenu',
  'copy',
  'cut',
  'dblclick',
  'drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'focus',
  'input',
  'invalid',
  'keydown',
  'keypress',
  'keyup',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'paste',
  'ratechange',
  'reset',
  'scroll',
  'seeked',
  'seeking',
  'submit',
  'stalled',
  'suspend',
  'timeupdate',
  'transitionend',
  'touchcancel',
  'touchend',
  'touchmove',
  'touchstart',
  'volumechange',
  'waiting',
  'wheel'
];

module.exports = EventManager;
