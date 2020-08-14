import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import propTypes from 'prop-types';
import styles from 'static/index.less';
import hint from 'static/hint.svg';
let width, height, fontSize;
export default function TimePicker({size, zIndex, setTime, title, attachElement}) {
	const [selectedRange, setSelectedRange] = useState([null, null]);
	const [visible, setVisible] = useState(false);
	const ref = useRef(null);
	const positionRef = useRef(null);
	const container = useMemo(() => {
		return React.cloneElement(attachElement, {onClick: () => setVisible(true), ref: positionRef})
	}, [attachElement])
	const width = useMemo(() => {
		switch (size) {
			case 'small':
				return '900px'
			case 'medium':
				return '1100px';
			case 'big':
				return '1400px';
			default:
				return '900px';
		}
	}, [size]);
	const fontSize = useMemo(() => {
		switch (size) {
			case 'small':
				return '10px'
			case 'medium':
				return '12px';
			case 'big':
				return '16px';
			default:
				return '10px';
		}
	}, [size]);
	const height = useMemo(() => {
		switch (size) {
			case 'small':
				return '400px'
			case 'medium':
				return '500px';
			case 'big':
				return '800px';
			default:
				return '400px';
		}
	}, [size]);

	const index = useMemo(() => {
		const logo = [<div key="hint" className = {styles.index}><img src = {hint} alt = 'H/M' style = {{width: '100%', height: '100%'}}/></div>];
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
		const target = e.target;
			const indexOffSet = index.length;
			let nextSelectedCell = selectedRange.map(v => v);
			if (selectedRange[0] !== null && selectedRange[1] !== null) {
				nextSelectedCell = [null, null];
				nextSelectedCell[0] = target.dataset.id;
				let recover = [];
				if (Number.parseInt(selectedRange[0]) < Number.parseInt(selectedRange[1]))
					recover = [...ref.current.children].slice(indexOffSet + Number.parseInt(selectedRange[0]), indexOffSet + Number.parseInt(selectedRange[1]) + 1);
				else if (Number.parseInt(selectedRange[0]) > Number.parseInt(selectedRange[1]))
					recover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(selectedRange[1]) + 1)
						.concat([...ref.current.children].slice(indexOffSet + Number.parseInt(selectedRange[0]), [...ref.current.children].length))
				else recover = [[...ref.current.children][indexOffSet + Number.parseInt(selectedRange[0])]];
				recover.forEach(cell => cell.className = styles['cell']);
				target.className = styles['cell-selected'];
			} else if (selectedRange[0] !== null) {
				nextSelectedCell[1] = target.dataset.id;
				let cover, first, last;
				if (Number.parseInt(nextSelectedCell[1]) > Number.parseInt(nextSelectedCell[0])) {
					cover = [...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0]), indexOffSet + Number.parseInt(nextSelectedCell[1]) + 1);
					first = cover.shift();
					last = cover.pop();
				} else if (Number.parseInt(nextSelectedCell[1]) < Number.parseInt(nextSelectedCell[0])) {
					cover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(nextSelectedCell[1]))
						.concat([...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0]) + 1, [...ref.current.children].length))
					first = [...ref.current.children][indexOffSet + Number.parseInt(nextSelectedCell[1])];
					last = [...ref.current.children][indexOffSet + Number.parseInt(selectedRange[0])];
				} else {
					cover = [];
					first = last = {};
				}
				first.className = last.className = styles['cell-selected'];
				cover.forEach(cell => cell.className = styles['cell-included']);
				setVisible(false);
			} else {
				nextSelectedCell[0] = target.dataset.id;
				target.className = styles['cell-selected'];
			}
			setSelectedRange(nextSelectedCell);
			const begin_res = Number.parseInt(nextSelectedCell[0]);
			const end_res = Number.parseInt(nextSelectedCell[1]);
			const begin = begin_res >= 0 ? `${Math.floor(begin_res / 60)}:${begin_res % 60 < 10 ? '0'.concat(begin_res % 60) : begin_res % 60}` : '';
			const end = end_res >= 0 ? `${Math.floor(end_res / 60)}:${end_res % 60 < 10 ? '0'.concat(end_res % 60) : end_res % 60}` : '';
			setTime(`${begin}-${end}`)
	}, [selectedRange, index])

	const handleHoverHighLight = useCallback((e, flag) => {
		e.preventDefault();
		const indexOffset = index.length;
		const imgOffset = 1;
		const columnOffset = 60;
		const highLightColumnIndex = ref.current.children[imgOffset + e.target.dataset.id % 60];
		const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(e.target.dataset.id / 60)];
		highLightColumnIndex.className = highLightRowIndex.className = flag ? styles['index-hover'] : styles['index'];
		if (selectedRange[0] !== null && selectedRange[1] === null) {
			let cover = [];
			if (Number.parseInt(e.target.dataset.id) > Number.parseInt(selectedRange[0]))
				cover = [...ref.current.children].slice(indexOffset + Number.parseInt(selectedRange[0]) + 1, indexOffset + Number.parseInt(e.target.dataset.id))
			else if (Number.parseInt(e.target.dataset.id) < Number.parseInt(selectedRange[0]))
				cover = [...ref.current.children].slice(indexOffset, indexOffset + Number.parseInt(e.target.dataset.id))
					.concat([...ref.current.children].slice(indexOffset + Number.parseInt(selectedRange[0]) + 1, [...ref.current.children].length))
			else cover = [];
			cover.forEach(cell => cell.className = flag ? styles['cell-included'] : styles['cell']);
		}
	}, [selectedRange, index])

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

	useEffect(() => {
		let clear;
		document.addEventListener('click', clear = e => {
			if (!ref.current.contains(e.target) && e.target !== positionRef.current)
				setVisible(false);
		})
		return () => {
			document.removeEventListener(clear);
		};
	}, [ref, positionRef]);
	return (
		<>
			{container}
			{positionRef.current && (
				<div 
					className={styles['time-picker-wrapper']} 
					style={{
						zIndex, 
						fontSize, 
						width, 
						height, 
						left: `${(positionRef.current.getBoundingClientRect().left + positionRef.current.getBoundingClientRect().right) / 2}px`,
						display: `${visible ? 'block' : 'none'}`,
						top: `${positionRef.current.getBoundingClientRect().top + positionRef.current.getBoundingClientRect().height}px`,
						transform: 'translateX(-50%)'
					}}
				>
					<div className={styles.header}>{title}</div>
					<div className={styles.container} ref = {ref}>
						{index.concat(timePoint)}
					</div>
				</div>
			)}

		</>

	)
}

TimePicker.propTypes = {
	zIndex: propTypes.number,
	setTime: propTypes.func.isRequired,
	size: propTypes.oneOf(['small', 'medium', 'big']),
	title: propTypes.string,
	attachElement: propTypes.element.isRequired,
}
TimePicker.defaultProps = {
	zIndex: 1,
	size: 'medium',
	setTime: () => {},
	title: 'react time picker',
}