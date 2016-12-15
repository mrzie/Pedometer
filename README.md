# Pedometer

Little simple javascript input widget for mobile device.

Support IE8+ only.(use addEventListener & Array.prototype.forEach & querySelector).

##usage
```javascript
pedometer = new Pedometer(selector, options)
```

###options
- `range` Array of String
- `min` Number, default 0
- `max` Number, default the lengh of range minus 1
- `step` Number, default 40, height(px) of each item
- `forget` Boolean, default false, remove all the event listener if true
- `index` Number, the default selection index

##Methods
###init
```javascript
pedometer.init(options);
```

###scrollTo
set the value of a pedometer and trigger the event bind

###on
attach event
```javascript
pedometer.on(event, callback);
```

####event
- `change`
- `touchstart`
- `touchmove`
- `touchend`

####callback
```javascript
callback(event, self, instances);
```
accept arguments
- `event` object or undefined
- `self` pedometer instance
- `instances` pedometer instances

###emit
```javascript
pedometer.emit(event)
```


##Example

```javascript
var hourSelector = new Pedometer('#hour-selector', {
    range: ['08', '09', '10', '11'],
    min: 0,
    max: 3,
    step: 40
    })

// event bind
var onChange = function (event, self, instances){
    console.log(event); // {value: {index: 1, text: '09'}}
    console.log(self === hourSelector); // true
    console.log(instances); // equal to Pedometer.instances, an Array contains all the instances of Pedometer
};

hourSelector.on('change', onChange);

hourSelector.scrollTo(1); // '09'
console.log(hourSelector.value); // {index: 1, text: '09'}

hourSelector.forget('change', onChange);
hourSelector.forget('change');
hourSelector.forget();

// reset
hourSelector.init({range: ['00', '15', '30', '45'], step: 30});
    
```