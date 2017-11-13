import Utils from './util/Utils';

/**
 * Base HTML Node class.
 **/
class Node {
    constructor(dom) {
        if (dom === undefined) {
            this.dom = this.createDom();

            if (!(this.dom instanceof jQuery)) {
                throw new Error("Method createDom() must return instance of an jQuery object");
            }
        } else {
            if (dom instanceof jQuery) {
                this.dom = dom;
            } else {
                throw new Error("Non-jquery object cannot be passed into Node.construct()");
            }
        }

        this.dom.data('--wrapper', this);
    }

    get id() { return this.dom.attr('id') }
    set id(value) { this.dom.attr('id', value) }

    get visible() {
      return this.dom.is(':visible');
    }

    set visible(value) {
      if (value) {
        this.dom.show();
      } else {
        this.dom.hide();
      }
    }

    get opacity() {
      return this.dom.css('opacity');
    }

    set opacity(value) {
      this.dom.css('opacity', value);
    }

    get enabled() {
      return !this.dom.prop("disabled");
    }

    set enabled(value) {
      this.dom.prop('disabled', !value);
    }

    get focused() {
      return this.dom.is(':focus');
    }

    get x() { return this.dom.position().left; }
    set x(value) { this.dom.css({left: value}); }

    get y() { return this.dom.position().top; }
    set y(value) {
        this.dom.css({top: value});
    }

    get position() { return [this.x, this.y]; }
    set position(value) {
        if (value instanceof Array && value.length >= 2) {
            this.x = value[0];
            this.y = value[1];
        }
    }

    get width() { return this.dom.width() }
    set width(value) { this.dom.width(value) }

    get height() { return this.dom.height() }
    set height(value) { this.dom.height(value) }

    get size() { return [this.width, this.height] }
    set size(value) {
        if (value instanceof Array && value.length >= 2) {
            this.width = value[0];
            this.height = value[1];
        }
    }

    get padding() {
      return [
          Utils.toPt(this.dom.css('padding-top')),
          Utils.toPt(this.dom.css('padding-right')),
          Utils.toPt(this.dom.css('padding-bottom')),
          Utils.toPt(this.dom.css('padding-left'))
      ];
    }

    set padding(value) {
      if (value instanceof Array) {
          if (value.length >= 4) {
            this.dom.css({
              'padding-top': value[0], 'padding-right': value[1],
              'padding-bottom': value[2], 'padding-left': value[3]
            });
          } else if (value.length >= 2) {
            this.dom.css({
              'padding-top': value[0], 'padding-right': value[1],
              'padding-bottom': value[0], 'padding-left': value[1]
            });
          } else if (value.length >= 1) {
            this.dom.css('padding', value[0]);
          } else {
            this.dom.css('padding', 0);
          }
      } else {
          this.dom.css('padding', value);
      }
    }

    get parent() {
      var parent = null;

      if (this.dom.data('--wrapper-dom')) {
        parent = this.dom.data('--wrapper-dom').parent();
      } else {
        parent = this.dom.parent();
      }

      if (!parent) {
        return null;
      }

      return Node.getFromDom(parent);
    }

    get userData() {
      return this.dom.data('--user-data');
    }

    set userData(value) {
      this.dom.data('--user-data', value);
    }

    get controller() {
      return this._controller;
    }

    set controller(object) {
      this._controller = object;
    }

    createDom() {
        throw new Error("Cannot call abstract method createDom()");
    }

    requestFocus() {
      this.focus();
    }

    relocate(x, y) {
      this.position = [x, y];
    }

    resize(width, height) {
      this.size = [width, height];
    }

    focus() {
      this.dom.focus();
    }

    css(value) {
      return this.dom.css(...arguments);
    }

    data(params) {
      if (arguments.length === 1) {
        return this.dom.data(...arguments);
      } else {
        this.dom.data(...arguments);
        return this;
      }
    }

    lookup(selector) {
      var dom = this.dom.find(selector).first();

      if (dom) {
        return Node.getFromDom(dom);
      }

      return null;
    }

    lookupAll(selector) {
      var nodes = [];

      this.dom.find(selector).each(() => {
        nodes.push(Node.getFromDom(this));
      });

      return nodes;
    }

    toFront() {
      var parent = this.parent;

      if (parent) {
        if (parent['childToFront']) {
          parent.childToFront(this);
        }
      }
    }

    toBack() {
      var parent = this.parent;

      if (parent) {
        if (parent['childToBack']) {
          parent.childToBack(this);
        }
      }
    }

    free() {
      var wrapperDom = this.dom.data('--wrapper-dom');

      if (wrapperDom) {
        wrapperDom.remove();
      } else {
        this.dom.detach();
      }

      return this;
    }

    show() {
      this.dom.show();
      return this;
    }

    hide() {
      this.dom.hide();
      return this;
    }

    toggle() {
      this.dom.toggle();
      return this;
    }

    on(event, callback) {
      this.dom.on(event, (event) => {
        event.sender = this;
        callback.call(this, event);
      });

      return this;
    }

    off(event) {
      this.dom.off(event);
      return this;
    }

    trigger(event, params) {
      return this.dom.trigger(event, params);
    }

    child(id) {
      return null;
    }

    load(object, controller) {
      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          if (prop[0] == '_') {
            continue;
          }

          const value = object[prop];

          switch (prop) {
            case 'on':
              if (controller) {
                for (var event in value) {

                  if (value.hasOwnProperty(event)) {
                    const handler = value[event];
                    if (typeof controller[handler] === 'function') {
                      this.on(event, controller[handler].bind(controller));
                    }
                  }
                }
              }
              break;

            default:
              this[prop] = value;
              break;
          }
        }
      }
    }

    static getFromDom(jqueryObject) {
        if (jqueryObject === null || jqueryObject.length === 0) {
            return null;
        }

        if (jqueryObject instanceof jQuery) {
            var wrapper =  jqueryObject.data('--wrapper');
            return wrapper ? wrapper : new Node(jqueryObject);
        }

        throw new Error("Node.getFromDom(): 1 argument must be an jQuery object");
    }
}

export default Node;
