# dom-event-manager

[![Build Status](https://travis-ci.org/crysalead-js/dom-event-manager.svg?branch=master)](https://travis-ci.org/crysalead-js/dom-event-manager)

The `EventManager` manage events in a delegated way. It captures all event on at a top level container (`document.body` by default). When an event occurs, the delegate handler is executed starting form `event.target` up to the defined container.

## API

### new EventManager(delegateHandler, container)

Creates a `EventManager` instance with `delegateHandler` as delegate handler. The delegated handler take 2 parameters the name of the event (w/o the "on" prefix) and the event itself. The role of the delegated handler is to execute the event handler available for the provided `event.delegateTarget` DOM element.

```js

var eventManager = new EventManager(function(name, e) {
    console.log("event received": name);
    console.log("on element": e.delegateTarget);
});

document.getElementById(...).click();

```

### .bind(name)

Binds an event on the container.

### .unbind(name)

Unbinds an event from the container.

### .unbind()

Unbinds all events from the container.

### .binded()

Returns all binded events.

### .bindDefaultEvents()

Binds all common events.
