# Pedometer

Little simple javascript input widget for mobile device.

Support IE8+ only.(use addEventListener & querySelector).


##Example

```javascript
var hourSelector = new Pedometer('#hour-selector', {
    range: ['08', '09', '10', '11'],
    min: 0,
    max: 3,
    step: 40// 40px each item
    })

hourSelector.scrollTo(1); // '09'
console.log(hourSelector.value); // {index: 1, text: '09'}

// reset
hourSelector.init({range: ['00', '15', '30', '45'], step: 30});
    
```