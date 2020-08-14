import React, {useState} from 'react';
import { render} from 'react-dom';
import TimePicker from 'components/time-picker';
function App() {
    const [time, setTime] = useState('');
    return (
        <div>
            <TimePicker setTime = {setTime} attachElement={<input style={{position:'absolute',left:'500px',top:'100px',width:'400px', textAlign: 'center'}} value={time} placeholder='input' />}/>
        </div>
    )
};
render(<App />, document.getElementById("root"));