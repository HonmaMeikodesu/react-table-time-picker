import React, {useState} from 'react';
import { render} from 'react-dom';
import TimePicker from 'components/time-picker';
function App() {
    const [time, setTime] = useState('');
    return (
        <div>
            <TimePicker setTime = {setTime} position='bottom' maxWidth={1000} maxHeight={400} attachElement={<input style={{position:'absolute',left:'500px',top:'100px',width:'400px', textAlign: 'center'}} value={time} placeholder='input' />}/>
        </div>
    )
};
render(<App />, document.getElementById("root"));