import React, { useState } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'components/index';

function App() {
  const [time, setTime] = useState([moment(), moment()]);
  const [anotherTime, setAnotherTime] = useState([moment().subtract(1, 'days'), moment().subtract(4, 'hours')]);
  const [v, setV] = useState(false);
  const [anotherV, setAnotherV] = useState(false);
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
            width={2000}
            maxWidth={1000}
            maxHeight={500}
            height={1000}
            fontSize={10}
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
