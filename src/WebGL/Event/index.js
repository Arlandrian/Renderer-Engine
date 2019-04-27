function Event(sender) {
  this._sender = sender;
  this._listeners = [];
}

Event.prototype = {
  attach: function (listener) {
      this._listeners.push(listener);
      return listener;
  },
  detach: function (listener) {
      this._listeners.splice(this._listeners.indexOf(listener),1);
  },
  notify: function (args) {
      for (var i = 0; i < this._listeners.length; i++) {
          this._listeners[i](this._sender, args);
      }
  }
};

export default Event;