/**
 * git: https://github.com/mrzie/Pedometer.git
 * version: 0.1.7
 */

(function (fn) {
    /**
     * use addEventListener , Array.prototype.forEach and querySelector
     * no Event-Delegation
     */
    window.Pedometer = fn(document, window);
})(function (document, window) {

    var Pedometer = function (el, options) {
        /**
         * options:
         *   range
         *   min(index)  default 0
         *   max(index)  default rangeLength - 1
         *   step
         */
        if (this.constructor != Pedometer) {
            return new Pedometer(el, options);
        }
        if (options.debug) {
            /**
             * I don't want to do this...
             * check el & range & ...
             */
        }

        this.el = document.querySelector(el);
        this.el._scroll = this;
        this.selector = el;
        this.events = {};
        Pedometer.instances[el] = this;

        this.init(options);
    };

    Pedometer.prototype.init = function (options) {
        // default step
        this.step = options.step || 40;
        this.range = options.range;
        this.maxIndex = this.range.length - 1;
        this.min = options.min;
        this.max = options.max;

        if (options.forget) {
            this.events = {};
        }

        this.body = formScrollBody(this.range);
        this.el.innerHTML = '';
        this.el.appendChild(this.body);


        if (options.index) {
            this.value = {
                index: options.index,
                text: this.range[options.index]
            };
            this.scrollTo(options.index);
        }
        else {
            this.value = {
                index: 0,
                text: this.range[0]
            };
        }

        this.bindEvents();
    };

    Pedometer.prototype.bindEvents = function () {
        this.el.addEventListener('touchstart', touchStart);
        this.el.addEventListener('touchmove', touchMove);
        this.el.addEventListener('touchend', touchEnd);
    };

    Pedometer.prototype.calcIndex = function (offset) {
        var
            index = Math.round(offset),
            min = this.min != undefined ? this.min : 0,
            max = this.max != undefined ? this.max : this.maxIndex,
            change;
        
        // if (index < min) index = min;
        // if (index > max) index = max;
        index = index < min ? min : index > max ? max : index;
        
        change = index != this.value.index;

        this.value = {
            index: index,
            text: this.range[index]
        };

        if (change) {
            this.emit('change', { value: this.value });
        }
    }

    Pedometer.prototype.scrollTo = function (value) {
        this.calcIndex(value);
        // doesn't work in iOS?
        // this.body.style = 'transition: transform .2s ease-out; transform: translate3d(0, ' + (-this.value.index * this.step) + 'px, 0)';
        this.body.style.transition = 'transform .2s ease-out, -webkit-transform .2s ease-out';
        this.body.style.transform = 'translate3d(0, ' + (-this.value.index * this.step) + 'px, 0)';
        this.body.style.webkitTransform = 'translate3d(0, ' + (-this.value.index * this.step) + 'px, 0)';        
        var self = this;
        setTimeout(function () {
            self.body.style.transition = 'none';
        }, 200);
    };

    Pedometer.prototype.distroy = function () {

    };

    Pedometer.prototype.on = function (event, callback) {
        if (this.events[event] instanceof Array) {
            this.events[event].push(callback);
        }
        else {
            this.events[event] = [callback];
        }
    };

    Pedometer.prototype.emit = function (event, params) {
        if (event in this.events) {
            var callbacks = this.events[event], self = this;
            callbacks.forEach(function (callback) {
                callback(params, self, Pedometer.instances);
            })
        }
    };

    Pedometer.prototype.forget = function (event, callback) {
        if (callback) {
            if (event) {
                var cbs = this.events[event];
                cbs.splice(cbs.indexOf(callback), 1);
            }
            else {
                this.events = {};
            }
        }
        else {
            delete this.events[event];
        }
    }

    Pedometer.instances = {};

    var touchStart = function (e) {
        e.preventDefault();
        var
            self = this._scroll,
            touch = e.targetTouches[0];

        self.begin = getOffset(self.el) - parseInt(touch.clientY);
        self.identifier = touch.identifier;
        self.emit('touchstart');
    };

    var touchMove = function (e) {
        var self = this._scroll;
        findTouch(e.targetTouches, function (touch) {
            self.body.style.transform = 'translate3d(0, ' + parseInt(self.begin + touch.clientY) + 'px, 0)';
            self.body.style.webkitTransform = 'translate3d(0, ' + parseInt(self.begin + touch.clientY) + 'px, 0)';            
            self.emit('touchmove');
        })
            && e.preventDefault();
    };

    var touchEnd = function (e) {
        var self = this._scroll;
        findTouch(e.changedTouches, function (touch) {
            var currentOffset = getOffset(self.el);
            self.scrollTo(-currentOffset / self.step);
            self.emit('touchend');
        })
            && e.preventDefault();
    };

    var formScrollBody = function (range) {
        var ul = document.createElement('ul');

        range.forEach(function (item) {
            var li = document.createElement('li');
            li.innerHTML = item;
            ul.appendChild(li);
        });

        return ul;
    };

    var getOffset = function (el) {
        var
            matrix = getComputedStyle(el._scroll.body).transform || getComputedStyle(el._scroll.body).webkitTransform || 'none',
            offset = matrix != 'none' ? matrix.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}[\d\.]+))\))/)[6] : 0;

        return offset;
    };

    var findTouch = function (touches, callback) {
        // var length = touches.length, i;
        var ret = false;
        Array.prototype.forEach.call(touches, function (item) {
            for (var key in Pedometer.instances) {
                if (item.identifier == Pedometer.instances[key].identifier) {
                    callback(item);
                    ret = true;
                }
            }
        });
        return ret;
    }

    return Pedometer;
})
