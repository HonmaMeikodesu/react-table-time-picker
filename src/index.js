import React from 'react';
import { render} from 'react-dom';
import TimePicker from 'components/time-picker';
const App = () => (
    <TimePicker />
);
render(<App />, document.getElementById("root"));