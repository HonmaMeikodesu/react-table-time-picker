# react-table-timepicker

![](https://i.loli.net/2020/08/27/p2PgHQXD5a9JoTm.jpg)

# Description

Time picker represented in table form

# Dependencies

- React.JS
- Moment.JS

# Installation

``` bash
npm run install --save react-table-timepicker
```

# Usage

``` jsx
import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import TimePicker from 'react-table-timepicker';

function App() {
  const [time, setTime] = useState([moment(), moment()]);
  return (
    <div>
      <TimePicker
        setValue={setTime}
        value={time}
        attachElement={(
          <input />
        )}
      />
    </div>
  );
}
render(<App />, document.getElementById('root'));
```

# API

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
|  zIndex | Number | 1 | css z-index |
| maxWidth | Number | undefined | css max-width
| maxHeight | Number | undefined | css max-height
| position | ['top','right','bottom','left'] | medium | position of the time picker relative to its attach element
| value | [moment(),moment()] | - | moment instance of begin time and end time
| setValue | Function | - | function to set the value
| size | ['small','medium','big'] | medium | size of the time picker
| attachElement | HTMLElement | - | the attachment for the time picker
| originColor | CSS Color | #66ccff | color of the table cell
| includedColor | CSS Color | rgba(102, 204, 255, 0.5) | color of the table cell when included between the begin time and end time
| selectedColor | CSS Color | #458bad | color of the table cell when selected as begin time or end time
| confirmModal | boolean | true | whether to pop up a confirm modal when begin time and end time are both selected