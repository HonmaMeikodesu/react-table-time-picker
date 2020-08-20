import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'components/time-picker';

function App() {
  const [time, setTime] = useState([moment(), moment().minute(40)]);
  return (
    <div>
      <TimePicker
        setValue={setTime}
        position="bottom"
        maxWidth={1000}
        maxHeight={400}
        size="medium"
        value={time}
        attachElement={(
          <input
            style={{
              position: 'absolute', left: '500px', top: '100px', width: '400px', textAlign: 'center',
            }}
            value={`${time[0].format('MM-DD HH:mm')} ~ ${time[1].format('MM-DD HH:mm')}`}
            placeholder="input"
          />
)}
      />
    </div>
  );
}
render(<App />, document.getElementById('root'));
