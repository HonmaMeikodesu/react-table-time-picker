/* eslint-disable no-unused-expressions */
import React, {
  useState, useCallback, useMemo, useRef, useEffect,
} from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
import styles from 'static/index.less';
import hint from 'static/hint.svg';
import time from 'static/time-circle-fill.svg';
import info from 'static/info-circle.svg';
import { formatTime } from 'utils';

export default function TimePicker({
  size, zIndex, maxHeight, maxWidth, position,
  confirmModal, positionRef, visible, setVisible, defaultValue, onValueChange,
}) {
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [onHoverRange, setOnHoverRange] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pickerBlur, setPickerBlur] = useState('');
  const [value, setValue] = useState(defaultValue);
  const ref = useRef(null);
  const headerRef = useRef(null);
  const maskRef = useRef(null);
  const timePickerRef = useRef(null);
  const crossDays = useMemo(() => {
    const beginDay = value[0].day();
    const endDay = value[1].day();
    return !(beginDay === endDay);
  }, [value]);
  const width = useMemo(() => {
    switch (size) {
      case 'small':
        return '800px';
      case 'medium':
        return '1100px';
      case 'big':
        return '1400px';
      default:
        return '800px';
    }
  }, [size]);
  const fontSize = useMemo(() => {
    switch (size) {
      case 'small':
        return '8px';
      case 'medium':
        return '12px';
      case 'big':
        return '16px';
      default:
        return '8px';
    }
  }, [size]);
  const height = useMemo(() => {
    switch (size) {
      case 'small':
        return '300px';
      case 'medium':
        return '460px';
      case 'big':
        return '600px';
      default:
        return '300px';
    }
  }, [size]);

  const index = useMemo(() => {
    const logo = [<div key="hint" className={styles.index}><img src={hint} alt="H/M" style={{ width: '100%', height: '100%' }} /></div>];
    const column = [];
    for (let i = 0; i < 60; i++) {
      column.push(
        <div key={`column-${i}`} className={styles.index} style={{ gridArea: `1 / ${i + 2} / 2 / ${i + 3}` }}>
          {i}
        </div>,
      );
    }
    const row = [];
    for (let i = 0; i < 24; i++) {
      row.push(
        <div key={`row-${i}`} className={styles.index} style={{ gridArea: `${i + 2} / 1 / ${i + 3} / 2` }}>
          {i}
        </div>,
      );
    }
    return logo.concat(column, row);
  }, []);

  // TODO containerLeft will lose precision when scrolling
  const containerLeft = useMemo(() => {
    const hitArea = positionRef.current.getBoundingClientRect(); // scroll bar is not includingly calculated here
    const tweakLeft = hitArea.left + window.scrollX;
    const tweakRight = hitArea.right + window.scrollX;
    const tweakWidth = maxWidth ? maxWidth < Number.parseInt(width, 10) ? maxWidth : Number.parseInt(width, 10) : Number.parseInt(width, 10);
    let result = null;
    (position === 'top' || position === 'bottom')
  && (result = `${(tweakLeft + tweakRight) / 2 - Number.parseInt(tweakWidth, 10) / 2 > 0 ? ((tweakLeft + tweakRight) / 2 - Number.parseInt(tweakWidth, 10) / 2) : 0}px`);
    position === 'left'
  && (result = `${tweakLeft - Number.parseInt(tweakWidth, 10) > 0 ? (tweakLeft - Number.parseInt(tweakWidth, 10)) : 0}px`);
    position === 'right'
  && (result = `${tweakRight}px`);
    return result;
  }, [maxWidth, position, positionRef, width]);

  const containerTop = useMemo(() => {
    const hitArea = positionRef.current.getBoundingClientRect();
    const tweakTop = hitArea.top + window.scrollY;
    const tweakBottom = hitArea.bottom + window.scrollY;
    const tweakHeight = maxHeight ? maxHeight < Number.parseInt(height, 10) ? maxHeight : Number.parseInt(height, 10) : Number.parseInt(height, 10);
    let result = null;
    (position === 'left' || position === 'right')
  && (result = `${(tweakTop + tweakBottom) / 2 - Number.parseInt(tweakHeight, 10) / 2 > 0 ? ((tweakTop + tweakBottom) / 2 - Number.parseInt(tweakHeight, 10) / 2) : 0}px`);
    position === 'top'
  && (result = `${tweakTop - Number.parseInt(tweakHeight, 10) > 0 ? (tweakTop - Number.parseInt(tweakHeight, 10)) : 0}px`);
    position === 'bottom'
  && (result = `${tweakBottom}px`);
    return result;
  }, [height, maxHeight, position, positionRef]);

  const handleCellClick = useCallback((e) => {
    e.preventDefault();
    const { target } = e;
    const indexOffSet = index.length;
    let nextSelectedCell = selectedRange.map((v) => v);
    const childrenList = [...ref.current.children];
    if (selectedRange[0] !== null && selectedRange[1] !== null) {
      nextSelectedCell = [null, null];
      nextSelectedCell[0] = target.dataset.id;
      let recover = [];
      if (Number.parseInt(selectedRange[0], 10) < Number.parseInt(selectedRange[1], 10)) {
        recover = childrenList.slice(indexOffSet + Number.parseInt(selectedRange[0], 10), indexOffSet + Number.parseInt(selectedRange[1], 10) + 1);
      } else if (Number.parseInt(selectedRange[0], 10) > Number.parseInt(selectedRange[1], 10)) {
        recover = childrenList.slice(indexOffSet, indexOffSet + Number.parseInt(selectedRange[1], 10) + 1)
          .concat(childrenList.slice(indexOffSet + Number.parseInt(selectedRange[0], 10), childrenList.length));
      } else recover = [childrenList[indexOffSet + Number.parseInt(selectedRange[0], 10)]];
      recover.forEach((cell) => cell.className = styles.cell);
      target.className = styles['cell-selected'];
    } else if (selectedRange[0] !== null) {
      nextSelectedCell[1] = target.dataset.id;
      let cover; let first; let last;
      if (Number.parseInt(nextSelectedCell[1], 10) > Number.parseInt(nextSelectedCell[0], 10)) {
        cover = childrenList.slice(indexOffSet + Number.parseInt(nextSelectedCell[0], 10), indexOffSet + Number.parseInt(nextSelectedCell[1], 10) + 1);
        first = cover.shift();
        last = cover.pop();
      } else if (Number.parseInt(nextSelectedCell[1], 10) < Number.parseInt(nextSelectedCell[0], 10)) {
        cover = crossDays ? childrenList.slice(indexOffSet, indexOffSet + Number.parseInt(nextSelectedCell[1], 10))
          .concat(childrenList.slice(indexOffSet + Number.parseInt(nextSelectedCell[0], 10) + 1, childrenList.length))
          : childrenList.slice(indexOffSet + Number.parseInt(nextSelectedCell[1], 10), indexOffSet + Number.parseInt(nextSelectedCell[0], 10) + 1);
        first = crossDays ? childrenList[indexOffSet + Number.parseInt(nextSelectedCell[1], 10)] : cover.shift();
        last = crossDays ? childrenList[indexOffSet + Number.parseInt(selectedRange[0], 10)] : cover.pop();
        if (!crossDays) {
          const temp = nextSelectedCell[0];
          // eslint-disable-next-line prefer-destructuring
          nextSelectedCell[0] = nextSelectedCell[1];
          nextSelectedCell[1] = temp;
        }
      } else {
        cover = [];
        first = last = {};
      }
      first.className = last.className = styles['cell-selected'];
      cover.forEach((cell) => cell.className = styles['cell-included']);
      const [begin, end] = formatTime(nextSelectedCell);
      const beginMoment = moment(value[0]);
      const endMoment = moment(value[1]);
      beginMoment.hour(begin.split(':')[0]).minute(begin.split(':')[1]);
      endMoment.hour(end.split(':')[0]).minute(end.split(':')[1]);
      setValue([beginMoment, endMoment]);
      if (confirmModal) { // delay committing the change
        setShowConfirm(true);
        setPickerBlur('blur(2px)');
        maskRef.current.style.width = `${timePickerRef.current.scrollWidth}px`;
        maskRef.current.style.height = `${timePickerRef.current.scrollHeight}px`;
      } else onValueChange([beginMoment, endMoment]); // commit the change right away
    } else {
      nextSelectedCell[0] = target.dataset.id;
      target.className = styles['cell-selected'];
    }
    setSelectedRange(nextSelectedCell);
  }, [index.length, selectedRange, value, onValueChange, confirmModal, crossDays]);

  const handleHoverHighLight = useCallback((e) => {
    e.preventDefault();
    const indexOffset = index.length;
    const imgOffset = 1;
    const columnOffset = 60;
    const highLightColumnIndex = ref.current.children[imgOffset + (e.target.dataset.id % 60)];
    const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(e.target.dataset.id / 60)];
    highLightColumnIndex.className = highLightRowIndex.className = styles['index-hover'];
    if (selectedRange[0] !== null && selectedRange[1] === null) {
      setOnHoverRange([selectedRange[0], e.target.dataset.id]);
      let cover = [];
      let beginIdx;
      let endIdx;
      let recover = [];
      const childrenList = [...ref.current.children];
      if (Number.parseInt(e.target.dataset.id, 10) > Number.parseInt(selectedRange[0], 10)) {
        beginIdx = indexOffset + Number.parseInt(selectedRange[0], 10) + 1;
        endIdx = indexOffset + Number.parseInt(e.target.dataset.id, 10);
        recover = childrenList.slice(indexOffset, beginIdx - 1)
          .concat(childrenList.slice(endIdx, childrenList.length));
        cover = childrenList.slice(beginIdx, endIdx);
      } else if (Number.parseInt(e.target.dataset.id, 10) < Number.parseInt(selectedRange[0], 10)) {
        beginIdx = indexOffset + Number.parseInt(selectedRange[0], 10) + 1;
        endIdx = indexOffset + Number.parseInt(e.target.dataset.id, 10);
        recover = crossDays ? childrenList.slice(endIdx, beginIdx - 1)
          : childrenList.slice(indexOffset, endIdx)
            .concat(childrenList.slice(beginIdx, childrenList.length));
        cover = crossDays ? childrenList.slice(indexOffset, endIdx)
          .concat(childrenList.slice(beginIdx, childrenList.length))
          : childrenList.slice(indexOffset + Number.parseInt(e.target.dataset.id, 10) + 1, indexOffset + Number.parseInt(selectedRange[0], 10));
        !crossDays && setOnHoverRange([e.target.dataset.id, selectedRange[0]]);
      } else cover = [];
      cover.forEach((cell) => cell.className !== styles['cell-included'] && (cell.className = styles['cell-included']));
      recover.forEach((cell) => cell.className !== styles.cell && (cell.className = styles.cell));
    }
  }, [selectedRange, index, setOnHoverRange, crossDays]);

  const handleBlur = useCallback((e) => {
    e.preventDefault();
    const imgOffset = 1;
    const columnOffset = 60;
    const highLightColumnIndex = ref.current.children[imgOffset + (e.target.dataset.id % 60)];
    const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(e.target.dataset.id / 60)];
    highLightColumnIndex.className = highLightRowIndex.className = styles.index;
  }, []);

  const handleClear = useCallback(() => {
    setSelectedRange([null, null]);
    setOnHoverRange(null);
    const beginMoment = moment(value[0]);
    const endMoment = moment(value[1]);
    beginMoment.hour(0).minute(0);
    endMoment.hour(0).minute(0);
    setValue([beginMoment, endMoment]);
    const indexOffSet = index.length;
    [...ref.current.children].slice(indexOffSet).forEach((cell) => cell.className = styles.cell);
  }, [index.length, value]);

  const timePoint = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        arr.push(
          <div
            key={`cell-${i * 60 + j}`}
            className={styles.cell}
            data-tooltip={`${i}:${j % 60 < 10 ? '0'.concat(j % 60) : j % 60}`}
            data-id={i * 60 + j}
            onClick={handleCellClick}
            onMouseEnter={(e) => handleHoverHighLight(e)}
            onMouseLeave={(e) => handleBlur(e)}
          />,
        );
      }
    }
    return arr;
  }, [handleBlur, handleCellClick, handleHoverHighLight]);

  useEffect(() => {
    let clear;
    document.addEventListener('click', clear = (e) => {
      if (!ref.current.parentNode.contains(e.target) && e.target !== positionRef.current) { setVisible(false); }
    });
    const indexOffSet = index.length;
    let cover; let first; let last;
    const defaultBegin = value[0].hour() * 60 + value[0].minute();
    const defaultEnd = value[1].hour() * 60 + value[1].minute();
    const childrenList = [...ref.current.children];
    if (defaultBegin < defaultEnd) {
      cover = childrenList.slice(indexOffSet + defaultBegin, indexOffSet + defaultEnd + 1);
      first = cover.shift();
      last = cover.pop();
    } else if (defaultBegin > defaultEnd && crossDays) {
      cover = childrenList.slice(indexOffSet, indexOffSet + defaultEnd)
        .concat(childrenList.slice(indexOffSet + defaultBegin + 1, childrenList.length));
      first = childrenList[indexOffSet + defaultEnd];
      last = childrenList[indexOffSet + defaultBegin];
    } else if (defaultBegin === defaultEnd) {
      cover = [];
      first = last = childrenList[indexOffSet + defaultBegin];
    } else {
      throw (new Error('arguments error!'));
    }
    first.className = last.className = styles['cell-selected'];
    cover.forEach((cell) => cell.className = styles['cell-included']);
    setSelectedRange([defaultBegin, defaultEnd]);
    return () => {
      document.removeEventListener('click', clear);
    };
  }, []); // missing of dependency is intended here

  useEffect(() => {
    visible && (headerRef.current.style.width = `${timePickerRef.current.scrollWidth - 10}px`);
  }, [visible]);

  return (
    <div
      className={styles['time-picker-wrapper']}
      ref={timePickerRef}
      style={{
        zIndex,
        fontSize,
        width,
        height,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        left: containerLeft,
        top: containerTop,
        display: `${visible ? 'block' : 'none'}`,
      }}
    >
      <div className={styles.header} ref={headerRef} style={{ filter: pickerBlur }}>
        <div className={styles['header-icon']}>
          <img src={time} alt="time-picker" />
        </div>
        <div className={styles['header-current-time']}>
          {selectedRange[1] !== null ? `${formatTime(selectedRange)[0]} - ${formatTime(selectedRange)[1]}` : onHoverRange ? `${formatTime(onHoverRange)[0]} - ${formatTime(onHoverRange)[1]}` : 'waiting for input'}
        </div>
        <div className={styles.clear} onClick={() => handleClear()}>clear</div>
      </div>
      {/* prevent unneccessary scrollbar appears due to grid overlay */}
      <div className={styles.container} ref={ref} style={{ width: `${Number.parseInt(width, 10) - 10}px`, filter: pickerBlur }}>
        {index.concat(timePoint)}
      </div>
      {
    confirmModal && (
      <div
        className={styles.mask}
        ref={maskRef}
        style={{
          display: showConfirm ? 'block' : 'none',
          fontSize,
        }}
      >
        <div className={styles.confirm}>
          <div className={styles['confirm-title']}>
            <div className={styles['confirm-title-image']}>
              <img src={info} alt="" />
            </div>
            <div className={styles['confirm-title-hint']}>Confirm</div>
          </div>
          <div className={styles['confirm-time']}>
            <div>
              {`${value[0].format('HH:mm')} - ${value[1].format('HH:mm')}`}
            </div>
          </div>
          <div className={styles['confirm-select']}>
            <button type="button" className={styles['confirm-yes']} onClick={() => { setShowConfirm(false); setVisible(false); setPickerBlur(''); onValueChange(value); }}>Yes</button>
            <button type="button" className={styles['confirm-no']} onClick={() => { setShowConfirm(false); setPickerBlur(''); }}>No</button>
          </div>
        </div>
      </div>
    )
  }
    </div>
  );
}

TimePicker.propTypes = {
  zIndex: propTypes.number.isRequired,
  maxWidth: propTypes.number.isRequired,
  maxHeight: propTypes.number.isRequired,
  position: propTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
  size: propTypes.oneOf(['small', 'medium', 'big']).isRequired,
  confirmModal: propTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  positionRef: propTypes.object.isRequired,
  visible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
  defaultValue: propTypes.arrayOf(propTypes.instanceOf(moment)).isRequired,
  onValueChange: propTypes.func.isRequired,
};
