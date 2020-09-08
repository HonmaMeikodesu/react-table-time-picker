import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'components/index';

function App() {
  const [time, setTime] = useState([moment().subtract(1, 'day'), moment()]);
  const [anotherTime, setAnotherTime] = useState([moment('1970-01-03 12:03:00'), moment('1970-01-03 18:00:00')]);
  const [v, setV] = useState(true);
  const [anotherV, setAnotherV] = useState(true);
  return (
    <>
      <div style={{ height: '200%' }} />
      <button type="button" onClick={() => setV(!v)}>timepicker1</button>
      <div />
      <button type="button" onClick={() => setAnotherV(!anotherV)}>timepicker2</button>
      {
        v && (
          <TimePicker
            position="top"
            size="small"
            defaultValue={[time[0], time[1]]}
            onValueChange={(arg) => setTime(arg)}
            attachElement={(
              <div>
                <div>click</div>
                <input
                  readOnly
                  style={{
                    position: 'absolute', left: '10px', top: '100px', width: '400px', textAlign: 'center',
                  }}
                  value={`${time[0].format('MM-DD HH:mm')} ~ ${time[1].format('MM-DD HH:mm')}`}
                  placeholder="input"
                />
              </div>
            )}
          />
        )
      }
      {
        anotherV && (
          <TimePicker
            className="customClassName"
            position="bottom"
            size="medium"
            minuteStep={5}
            hourStep={1}
            originColor="#ecf0f1"
            includedColor="rgb(52, 73, 94)"
            selectedColor="#e64c3c"
            confirmModal={false}
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
