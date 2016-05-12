var triggerEvent = require("./helper/trigger-event");
var EventManager = require("..");

describe("EventManager", function() {

  var eventManager;
  var logs = [];

  describe(".binded()", function() {

    it("returns all binded events", function() {

      eventManager = new EventManager(function(){});
      eventManager.bind("click");
      eventManager.bind("change");

      expect(eventManager.binded().sort()).toEqual(["change", "click"]);

    });

  });

  describe(".bindDefaultEvents()", function() {

    it("binds all default events", function() {

      eventManager = new EventManager(function(){});
      eventManager.bindDefaultEvents();

      expect(eventManager.binded().sort()).toEqual([
        'abort',
        'animationend',
        'animationiteration',
        'animationstart',
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
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'paste',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'reset',
        'scroll',
        'seeked',
        'seeking',
        'stalled',
        'submit',
        'suspend',
        'timeupdate',
        'touchcancel',
        'touchend',
        'touchmove',
        'touchstart',
        'transitionend',
        'volumechange',
        'waiting',
        'wheel'
      ]);

    });

  });

  it("throws an error if no handler is provided", function() {

    var closure = function() {
      new EventManager();
    };

    expect(closure).toThrow(new Error("The passed handler function is invalid"));

  });

  describe("with bubblable events", function() {

    var testElement;

    beforeEach(function() {
      testElement = document.createElement('div');
      testElement.id = 'test';
      testElement.innerHTML = '<div id="a"><div id="a-a"><div id="a-a-a"></div></div><div id="a-b"></div></div><div id="b"></div>';
      document.body.appendChild(testElement);

      eventManager = new EventManager(function(name, e) {
        var id = e.delegateTarget.id;
        logs.push({ name: name, id: id });
        if (id === "a-b") {
          e.stopPropagation();
        }
      }, document.getElementById('a'));
    });

    afterEach(function() {
      document.body.removeChild(testElement);
      eventManager.unbind();
      logs = [];
    });

    describe(".bind()", function() {

      it("bubbles event up to the container", function(done) {

        eventManager.bind("click");
        triggerEvent("click", document.getElementById("a-a-a"));

        setTimeout(function() {
          expect(logs).toEqual([
            { name: "click", id: "a-a-a" },
            { name: "click", id: "a-a" },
            { name: "click", id: "a" }
          ]);
          done();
        }, 10);

      });

      it("allows to stop event propagation", function(done) {

        eventManager.bind("click");
        triggerEvent("click", document.getElementById("a-b"));

        setTimeout(function() {
          expect(logs).toEqual([
            { name: "click", id: "a-b" }
          ]);
          done();
        }, 10);

      });

    });

    describe(".unbind()", function() {

      it("unbinds a binded events", function(done) {

        eventManager.bind("click");
        triggerEvent("click", document.getElementById("a-a-a"));

        eventManager.unbind("click");
        triggerEvent("click", document.getElementById("a-a-a"));

        setTimeout(function() {
          expect(logs.length).toBe(3);
          done();
        }, 10);

      });

    });

  });

  describe("with non bubblable events", function() {

    var testElement;

    beforeEach(function() {
      testElement = document.createElement('div');
      testElement.id = 'test';
      testElement.innerHTML = '<input id="textInput" type="text" />';
      document.body.appendChild(testElement);
      eventManager = new EventManager(function(name, e) {
        var id = e.delegateTarget.id;
        logs.push({ name: name, id: id });
      }, testElement);
    });

    afterEach(function() {
      document.body.removeChild = testElement;
      eventManager.unbind();
      logs = [];
    });

    describe(".bind()", function() {

      it("captures focus and blur events", function(done) {

        eventManager.bind("focus");
        eventManager.bind("blur");

        triggerEvent("focus", document.getElementById("textInput"));
        triggerEvent("blur", document.getElementById("textInput"));

        setTimeout(function() {
          expect(logs.length).toBe(4);
          done();
        }, 10);

      });

    });

  });

});
