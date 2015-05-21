/**
 * Trigger an event on the specified element.
 *
 * @param String name    The name of the event to trigger the "on" (e.g., "focus")
 * @param Object element The DOM element to trigger the event on.
 */
function triggerEvent(name, element) {

  var eventType;

  switch (name) {
    case "click":
    case "mousedown":
    case "mouseup":
      eventType = "MouseEvents";
    break;
    case "focus":
    case "change":
    case "blur":
    case "select":
      eventType = "HTMLEvents";
    break;
    default:
      throw new Error('Unsupported `"' + name + '"`event');
    break;
  }
  var event = document.createEvent(eventType);
  event.initEvent(name, name !== "change" , true);
  element.dispatchEvent(event, true);
}

module.exports = triggerEvent;
