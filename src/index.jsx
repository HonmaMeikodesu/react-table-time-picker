import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'components/index';

function App() {
  const [time, setTime] = useState([moment(), moment()]);
  return (
    <TimePicker
      position="bottom"
      maxWidth={1000}
      maxHeight={400}
      size="medium"
      onValueChange={(arg) => setTime(arg)}
      // originColor='red'
      // selectedColor='blue'
      // includedColor='black'
      attachElement={(
        <input
          readOnly
          style={{
            position: 'absolute', left: '10px', top: '800px', width: '400px', textAlign: 'center',
          }}
          value={`${time[0].format('MM-DD HH:mm')} ~ ${time[1].format('MM-DD HH:mm')}`}
          placeholder="input"
        />
      )}
    />
  );
}
render(<App />, document.getElementById('root'));
