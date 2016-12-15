/**
 * git: https://github.com/mrzie/Pedometer.git
 * version: 0.1.0
 */

(function (fn) {
    /**
     * use addEventListener and querySelector
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

        this.body = formScrollBody(this.range);
        this.el.innerHTML = '';
        this.el.appendChild(this.body);

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
            min = this.min || 0,
            max = this.max || this.maxIndex;

        // if (index < min) index = min;
        // if (index > max) index = max;
        index = index < min ? min : index > max ? max : index;
        this.value = {
            index: index,
            text: this.range[index]
        }
    }

    Pedometer.prototype.scrollTo = function (value) {
        this.calcIndex(value);
        this.body.style = 'transition: transform .2s ease-out; transform: translate3d(0, ' + (-this.value.index * this.step) + 'px, 0)';
        var self = this;
        setTimeout(function () {
            self.body.style.transition = 'none';
        }, 200);
    };

    Pedometer.prototype.distroy = function () {

    };

    Pedometer.instances = {};

    var touchStart = function (e) {
        e.preventDefault();

        var
            self = this._scroll,
            touch = e.targetTouches[0];

        self.begin = getOffset(self.el) - parseInt(touch.clientY);
        self.identifier = touch.identifier;

    };

    var touchMove = function (e) {
        findTouch(e.targetTouches, function (self, touch) {
            self.body.style.transform = 'translate3d(0, ' + parseInt(self.begin + touch.clientY) + 'px, 0)';
        })
            && e.preventDefault();
    };

    var touchEnd = function (e) {
        findTouch(e.changedTouches, function (self, touch) {
            var currentOffset = getOffset(self.el);
            self.scrollTo(-currentOffset / self.step);
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
            matrix = getComputedStyle(el._scroll.body).transform,
            offset = matrix != 'none' ? matrix.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/)[6] : 0;

        return offset;
    };

    var findTouch = function (touches, callback) {
        // var length = touches.length, i;
        var ret = false;
        Array.prototype.forEach.call(touches, function (item) {
            for (var key in Pedometer.instances) {
                if (item.identifier == Pedometer.instances[key].identifier) {
                    callback(Pedometer.instances[key], item);
                    ret = true;
                }
            }
        });
        return ret;
    }

    return Pedometer;
})

