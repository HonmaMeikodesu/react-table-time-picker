import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'components/index';

function App() {
  const [time, setTime] = useState([moment(), moment()]);
  const [anotherTime, setAnotherTime] = useState([moment(), moment()]);
  const [v, setV] = useState(false);
  const [anotherV, setAnotherV] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setV(!v)}>timepicker1</button>
      <div />
      <button type="button" onClick={() => setAnotherV(!anotherV)}>timepicker2</button>
      {
        v && (
          <TimePicker
            position="bottom"
            maxWidth={1000}
            maxHeight={400}
            size="medium"
            defaultValue={[time[0], time[1]]}
            onValueChange={(arg) => setTime(arg)}
            attachElement={(
              <input
                readOnly
                style={{
                  position: 'absolute', left: '10px', top: '100px', width: '400px', textAlign: 'center',
                }}
                value={`${time[0].format('MM-DD HH:mm')} ~ ${time[1].format('MM-DD HH:mm')}`}
                placeholder="input"
              />
            )}
          />
        )
      }
      {
        anotherV && (
          <TimePicker
            position="bottom"
            maxWidth={1000}
            maxHeight={400}
            size="medium"
            defaultValue={[anotherTime[0], anotherTime[1]]}
            onValueChange={(arg) => setAnotherTime(arg)}
            attachElement={(
              <input
                readOnly
                style={{
                  position: 'absolute', left: '10px', top: '200px', width: '400px', textAlign: 'center',
                }}
                value={`${anotherTime[0].format('MM-DD HH:mm')} ~ ${anotherTime[1].format('MM-DD HH:mm')}`}
                placeholder="input"
              />
            )}
          />
        )
      }
    </>
  );
}
render(<App />, document.getElementById('root'));
