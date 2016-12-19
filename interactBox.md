#interactBox

##用法
```javascript

var box = new interactBox(options)
```

`options`是一个json格式的对象。

包括
- `left` 格式{html: '内容', click: function(){}}
- `middle` 同上
- `right` 同上
- `onCreate` 执行一次
- `onShow` 每次show执行
- `onHide` 每次hide执行
- `content` 内容

`content`里面的字符串会在创建后加入DOM树，所以要绑定事件一定要在`onCreate`里面写。

##例子
```javascript
        // 选择预约时间
        var timeSelector = new interactBox({
            left: { html: '选择时间' },
            right: {
                html: '确认',
                click: function () {
                    timeValue = '' + this.hourSelector.value.text + ':' + this.minSelector.value.text;
                    timeArea.text(timeValue);
                    this.hide();
                    if (dateValue && timeValue) {
                        btn.removeClass('disabled');
                    }
                }
            },
            content: '<div class="scroll-time-wrapper"><div id="scroll-hour"></div><div id="scroll-min"></div></div>',
            onCreate: function () {
                hourSelector = new Pedometer('#scroll-hour', {
                    range: ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
                    step: 30
                });
                minSelector = new Pedometer('#scroll-min', {
                    range: ['00', '15', '30', '45'],
                    step: 30
                });
                hourSelector.on('change', function (e) {
                    if (e.value.index == 12) {
                        // index == 12  text == '21'
                        minSelector.max = 0;
                        minSelector.scrollTo(0);
                    }
                    else {
                        minSelector.max = undefined;
                    }
                });
                this.hourSelector = hourSelector;
                this.minSelector = minSelector;
            }
        });
```