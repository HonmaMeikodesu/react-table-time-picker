import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import propTypes from 'prop-types';
import styles from 'static/index.less';
import hint from 'static/hint.svg';
let width, height, fontSize;
export default function TimePicker({size, zIndex, setTimeRange, title}) {
	const [selectedCell, setSelectedCell] = useState([null, null]);
	const ref = useRef(null);
	useEffect(() => {
		switch (size) {
			case 'small':
				fontSize = '10px';
				width = '850px';
				height = '500px';
				break;
			case 'medium':
				fontSize = '12px';
				width = '1000px';
				height = '550px';
				break;
			case 'big':
				fontSize = '16px';
				width = '1300px';
				height = '800px';
				break;
			default:
				fontSize = '10px';
				width = '850px';
				height = '500px';
				break;
		}
	}, [size]);

	const index = useMemo(() => {
		const logo = [<img src = {hint} alt = 'H/M' style = {{width: '100%', height: '100%'}}/>];
		const column = [];
		for (let i = 0; i < 60; i++) {
			column.push(<div key = {`column-${i}`} className = {styles.index} style = {{gridArea: `1 / ${i + 2} / 2 / ${i + 3}`}}> {i} </div>)
		}
		const row = [];
		for (let i = 0; i< 24; i++) {
			row.push(<div key = {`row-${i}`} className = {styles.index} style = {{gridArea: `${i + 2} / 1 / ${i + 3} / 2`}}> {i} </div>)
		}
		return logo.concat(column, row);
	}, [])

	const handleCellClick = useCallback(e => {
		e.preventDefault();
		const indexOffSet = index.length;
		let nextSelectedCell = selectedCell.map(v => v);
		if (selectedCell[0] !== null && selectedCell[1] !== null) {
			nextSelectedCell = [null, null];
			nextSelectedCell[0] = e.target.dataset.id;
			let recover = [];
			if (Number.parseInt(selectedCell[0]) < Number.parseInt(selectedCell[1]))
				recover = [...ref.current.children].slice(indexOffSet + Number.parseInt(selectedCell[0]), indexOffSet + Number.parseInt(selectedCell[1]) + 1);
			else if (Number.parseInt(selectedCell[0]) > Number.parseInt(selectedCell[1]))
				recover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(selectedCell[1]) + 1)
					.concat([...ref.current.children].slice(indexOffSet + Number.parseInt(selectedCell[0]), [...ref.current.children].length))
			else recover = [[...ref.current.children][indexOffSet + Number.parseInt(selectedCell[0])]];
			recover.forEach(cell => cell.className = styles['cell']);
			e.target.className = styles['cell-selected'];
		} else if (selectedCell[0] !== null) {
			nextSelectedCell[1] = e.target.dataset.id;
			let cover, first, last;
			if (Number.parseInt(nextSelectedCell[1]) > Number.parseInt(nextSelectedCell[0])) {
				cover = [...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0]), indexOffSet + Number.parseInt(nextSelectedCell[1]) + 1);
				first = cover.shift();
				last = cover.pop();
			} else if (Number.parseInt(nextSelectedCell[1]) < Number.parseInt(nextSelectedCell[0])) {
				cover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(nextSelectedCell[1]))
					.concat([...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0]) + 1, [...ref.current.children].length))
				first = [...ref.current.children][indexOffSet + Number.parseInt(nextSelectedCell[1])];
				last = [...ref.current.children][indexOffSet + Number.parseInt(selectedCell[0])];
			} else {
				cover = [];
				first = last = {};
			}
			first.className = last.className = styles['cell-selected'];
			cover.forEach(cell => cell.className = styles['cell-included']);
		} else {
			nextSelectedCell[0] = e.target.dataset.id;
			e.target.className = styles['cell-selected'];
		}
		setSelectedCell(nextSelectedCell);
	}, [selectedCell, index])

	const handleHoverHighLight = useCallback((e, flag) => {
		const imgOffset = 1;
		const columnOffset = 60;
		const highLightColumnIndex = ref.current.children[imgOffset + e.target.dataset.id % 60];
		const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(e.target.dataset.id / 60)];
		highLightColumnIndex.className = highLightRowIndex.className = flag ? styles['index-hover'] : styles['index'];
		const indexOffset = index.length;
		if (selectedCell[0] !== null && selectedCell[1] === null) {
			let cover = [];
			if (Number.parseInt(e.target.dataset.id) > Number.parseInt(selectedCell[0]))
				cover = [...ref.current.children].slice(indexOffset + Number.parseInt(selectedCell[0]) + 1, indexOffset + Number.parseInt(e.target.dataset.id))
			else if (Number.parseInt(e.target.dataset.id) < Number.parseInt(selectedCell[0]))
				cover = [...ref.current.children].slice(indexOffset, indexOffset + Number.parseInt(e.target.dataset.id))
					.concat([...ref.current.children].slice(indexOffset + Number.parseInt(selectedCell[0]) + 1, [...ref.current.children].length))
			else cover = [];
			cover.forEach(cell => cell.className = flag ? styles['cell-included'] : styles['cell']);
		}
	}, [selectedCell, index])

	const timePoint = useMemo(() => {
		const arr = []
		for (let i = 0; i < 24; i++) {
			for (let j = 0; j < 60; j++) {
				arr.push(
					<div 
						key = {`cell-${i * 60 + j}`}
						className = {styles.cell}
						data-tooltip = {`${i}:${j % 60 < 10 ? '0'.concat(j % 60) : j % 60}`}
						data-id = {i * 60 + j}
						onClick = {handleCellClick}
						onMouseEnter = {e => handleHoverHighLight(e, true)}
						onMouseLeave = {e => handleHoverHighLight(e)}
					/>
				);
			}
		}
		return arr;
	}, [handleCellClick, handleHoverHighLight])
	
	return (
		<div className={styles['time-picker-wrapper']} style={{zIndex, fontSize, width, height}}>
			<div className={styles.header}>{title}</div>
			<div className={styles.container} ref = {ref}>
				{index.concat(timePoint)}
			</div>
		</div>

	)
}

TimePicker.propTypes = {
	zIndex: propTypes.number,
	setTimeRange: propTypes.func.isRequired,
	size: propTypes.oneOf(['small', 'medium', 'big']),
	title: propTypes.string,
	// size  font-size  width  height
	// small    10      850      400
	// medium   12      1000     500
	// big      16      1300     700
}
TimePicker.defaultProps = {
	zIndex: 1,
	size: 'medium',
	title: 'react time picker'
}