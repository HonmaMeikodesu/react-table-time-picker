/* eslint-disable no-unused-expressions */
import React, {
  useState, useCallback, useMemo, useRef, useEffect,
} from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
// import { Textfit } from 'react-textfit';
import styles from 'static/index.less';
import hint from 'static/hint.svg';
import time from 'static/time-circle-fill.svg';
import info from 'static/info-circle.svg';
import { formatTime, calculateIdxFromId } from 'utils';

const previousDay = '\n(previousDay)';
const nextDay = '\n(nextDay)';

export default function TimePicker({
  size, zIndex, maxHeight, maxWidth, position, height: inputHeight, width: inputWidth,
  confirmModal, positionRef, visible, setVisible, defaultValue, onValueChange, fontSize: inputFontSize,
  minuteStep, hourStep,
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
    if (inputWidth) return `${inputWidth}px`;
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
  }, [inputWidth, size]);
  const fontSize = useMemo(() => {
    if (inputFontSize) return `${inputFontSize}px`;
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
  }, [inputFontSize, size]);
  const height = useMemo(() => {
    if (inputHeight) return `${inputHeight}px`;
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
  }, [inputHeight, size]);

  const steppingMode = useMemo(() => (hourStep !== 1 || minuteStep !== 1), [hourStep, minuteStep]);

  const index = useMemo(() => {
    const logo = [<div key="hint" className={styles.index}><img src={hint} alt="H/M" style={{ width: '100%', height: '100%' }} /></div>];
    const column = [];
    let idx = 0;
    for (let i = 0; i < 60; i++) {
      if (!steppingMode || !(i % minuteStep)) {
        column.push(
          <div key={`column-${i}`} className={styles.index} style={{ gridArea: `1 / ${idx + 2} / 2 / ${idx + 3}` }}>
            <div>
              {i}
            </div>
          </div>,
        );
        idx += 1;
      }
    }
    const row = [];
    idx = 0;
    for (let i = 0; i < 24; i++) {
      if (!steppingMode || !(i % hourStep)) {
        row.push(
          <div key={`row-${i}`} className={styles.index} style={{ gridArea: `${idx + 2} / 1 / ${idx + 3} / 2` }}>
            <div>
              {i}
            </div>
          </div>,
        );
        idx += 1;
      }
    }
    return logo.concat(column, row);
  }, [hourStep, minuteStep, steppingMode]);

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
    const target = e.currentTarget;
    const indexOffSet = index.length;
    let nextSelectedCell = selectedRange.map((v) => v);
    const childrenList = [...ref.current.children];
    if (selectedRange[0] !== null && selectedRange[1] !== null) {
      nextSelectedCell = [null, null];
      nextSelectedCell[0] = target.dataset.id;
      let recover = [];
      const beginIdx = indexOffSet + calculateIdxFromId(selectedRange[0], minuteStep, hourStep);
      const endIdx = indexOffSet + calculateIdxFromId(selectedRange[1], minuteStep, hourStep);
      if (Number.parseInt(selectedRange[0], 10) < Number.parseInt(selectedRange[1], 10)) {
        recover = childrenList.slice(beginIdx, endIdx + 1);
      } else if (Number.parseInt(selectedRange[0], 10) > Number.parseInt(selectedRange[1], 10)) {
        // if selected startTime is bigger then selected endTime, it must be a cross day case
        // No need to do a cross day judgement here
        // clear previous cross day hints
        childrenList[endIdx].firstChild.innerText = childrenList[endIdx].dataset.tooltip;
        childrenList[beginIdx].firstChild.innerText = childrenList[beginIdx].dataset.tooltip;
        recover = childrenList.slice(indexOffSet, endIdx + 1)
          .concat(childrenList.slice(beginIdx, childrenList.length));
      } else recover = [childrenList[beginIdx]];
      recover.forEach((cell) => cell.className = styles.cell);
      target.className = styles['cell-selected'];
    } else if (selectedRange[0] !== null) {
      nextSelectedCell[1] = target.dataset.id;
      let cover; let first; let last;
      const beginIdx = indexOffSet + calculateIdxFromId(nextSelectedCell[0], minuteStep, hourStep);
      const endIdx = indexOffSet + calculateIdxFromId(nextSelectedCell[1], minuteStep, hourStep);
      if (Number.parseInt(nextSelectedCell[1], 10) > Number.parseInt(nextSelectedCell[0], 10)) {
        cover = childrenList.slice(beginIdx, endIdx + 1);
        first = cover.shift();
        last = cover.pop();
      } else if (Number.parseInt(nextSelectedCell[1], 10) < Number.parseInt(nextSelectedCell[0], 10)) {
        cover = crossDays ? childrenList.slice(indexOffSet, endIdx)
          .concat(childrenList.slice(beginIdx + 1, childrenList.length))
          : childrenList.slice(endIdx, beginIdx + 1);
        first = crossDays ? childrenList[endIdx] : cover.shift();
        last = crossDays ? childrenList[beginIdx] : cover.pop();
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
        // force reflow is obliged here
        maskRef.current.style.width = `${timePickerRef.current.scrollWidth}px`;
        maskRef.current.style.height = `${timePickerRef.current.scrollHeight}px`;
      } else { // commit the change right away and close the panel
        onValueChange([beginMoment, endMoment]);
        setVisible(false);
      }
    } else {
      nextSelectedCell[0] = target.dataset.id;
      target.className = styles['cell-selected'];
    }
    setSelectedRange(nextSelectedCell);
  }, [index.length, selectedRange, value, onValueChange, confirmModal, crossDays, setVisible, hourStep, minuteStep]);

  const handleHoverHighLight = useCallback((e) => {
    e.preventDefault();
    // highlight index
    const target = e.currentTarget;
    const indexOffset = index.length;
    const imgOffset = 1;
    const columnOffset = Math.ceil(60 / minuteStep);
    const highLightColumnIndex = ref.current.children[imgOffset + ((target.dataset.id % (60 * hourStep)) / minuteStep)];
    const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(target.dataset.id / (60 * hourStep))];
    highLightColumnIndex.className = highLightRowIndex.className = styles['index-hover'];
    // highlight cell and cancel previous cell highlight
    if (selectedRange[0] !== null && selectedRange[1] === null) {
      setOnHoverRange([selectedRange[0], target.dataset.id]);
      let cover = [];
      let beginIdx;
      let endIdx;
      let recover = [];
      const childrenList = [...ref.current.children];
      if (Number.parseInt(target.dataset.id, 10) > Number.parseInt(selectedRange[0], 10)) {
        beginIdx = indexOffset + calculateIdxFromId(selectedRange[0], minuteStep, hourStep) + 1;
        endIdx = indexOffset + calculateIdxFromId(target.dataset.id, minuteStep, hourStep);
        recover = childrenList.slice(indexOffset, beginIdx - 1)
          .concat(childrenList.slice(endIdx, childrenList.length));
        cover = childrenList.slice(beginIdx, endIdx);
      } else if (Number.parseInt(target.dataset.id, 10) < Number.parseInt(selectedRange[0], 10)) {
        // selected time range maybe cross 24 hours
        beginIdx = indexOffset + calculateIdxFromId(selectedRange[0], minuteStep, hourStep) + 1;
        endIdx = indexOffset + calculateIdxFromId(target.dataset.id, minuteStep, hourStep);
        if (crossDays) {
          // // pseudo-element relayout here will cause terrible performance disaster!
          // childrenList[endIdx].dataset.tooltip += nextDay;
          // childrenList[beginIdx - 1].dataset.tooltip = childrenList[beginIdx - 1].dataset.tooltip + previousDay;
          childrenList[endIdx].firstChild.innerText = childrenList[endIdx].dataset.tooltip + nextDay;
          childrenList[beginIdx - 1].firstChild.innerText = childrenList[beginIdx - 1].dataset.tooltip + previousDay;
        }
        recover = crossDays ? childrenList.slice(endIdx, beginIdx - 1)
          : childrenList.slice(indexOffset, endIdx)
            .concat(childrenList.slice(beginIdx, childrenList.length));
        cover = crossDays ? childrenList.slice(indexOffset, endIdx)
          .concat(childrenList.slice(beginIdx, childrenList.length))
          : childrenList.slice(indexOffset + Number.parseInt(target.dataset.id, 10) + 1, indexOffset + Number.parseInt(selectedRange[0], 10));
        !crossDays && setOnHoverRange([target.dataset.id, selectedRange[0]]);
      } else cover = [];
      cover.forEach((cell) => cell.className !== styles['cell-included'] && (cell.className = styles['cell-included']));
      recover.forEach((cell) => cell.className !== styles.cell && (cell.className = styles.cell));
    }
  }, [selectedRange, index, setOnHoverRange, crossDays, hourStep, minuteStep]);

  const handleBlur = useCallback((e) => {
    const target = e.currentTarget;
    e.preventDefault();
    const indexOffset = index.length;
    // cancel index highlight
    const imgOffset = 1;
    const columnOffset = Math.ceil(60 / minuteStep);
    const highLightColumnIndex = ref.current.children[imgOffset + ((target.dataset.id % (60 * hourStep)) / minuteStep)];
    const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(target.dataset.id / (60 * hourStep))];
    highLightColumnIndex.className = highLightRowIndex.className = styles.index;
    // restore crossday tooltips
    if (selectedRange[0] !== null && selectedRange[1] === null && crossDays && Number.parseInt(target.dataset.id, 10) < Number.parseInt(selectedRange[0], 10)) {
      const beginIdx = indexOffset + calculateIdxFromId(selectedRange[0], minuteStep, hourStep);
      const endIdx = indexOffset + calculateIdxFromId(target.dataset.id, minuteStep, hourStep);
      const childrenList = [...ref.current.children];
      // childrenList[beginIdx].dataset.tooltip = childrenList[beginIdx].dataset.tooltip.replace(previousDay, '');
      // childrenList[endIdx].dataset.tooltip = childrenList[endIdx].dataset.tooltip.replace(nextDay, '');
      childrenList[beginIdx].firstChild.innerText = childrenList[beginIdx].dataset.tooltip;
      childrenList[endIdx].firstChild.innerText = childrenList[endIdx].dataset.tooltip;
    }
  }, [crossDays, index.length, selectedRange, hourStep, minuteStep]);

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
        if (!steppingMode || !(i % hourStep || j % minuteStep)) {
          arr.push(
            <div
              key={`cell-${i * 60 + j}`}
              className={styles.cell}
              data-tooltip={`${i}:${j % 60 < 10 ? '0'.concat(j % 60) : j % 60}`}
              data-id={i * 60 + j}
              onClick={handleCellClick}
              onMouseEnter={(e) => handleHoverHighLight(e)}
              onMouseLeave={(e) => handleBlur(e)}
            >
              <span className={styles.before}>
                {`${i}:${j % 60 < 10 ? '0'.concat(j % 60) : j % 60}`}
              </span>
              <span className={styles.after} />
            </div>,
          );
        }
      }
    }
    return arr;
  }, [handleBlur, handleCellClick, handleHoverHighLight, hourStep, minuteStep, steppingMode]);

  useEffect(() => {
    let clear;
    document.addEventListener('click', clear = (e) => {
      if (visible && !positionRef.current.contains(e.target) && !ref.current.parentNode.contains(e.target) && e.target !== positionRef.current) { setVisible(false); }
    });
    const indexOffSet = index.length;
    let cover; let first; let last;
    const defaultBegin = value[0].hour() * 60 + value[0].minute();
    const defaultEnd = value[1].hour() * 60 + value[1].minute();
    const defaultBeginIdx = calculateIdxFromId(defaultBegin, minuteStep, hourStep);
    const defaultEndIdx = calculateIdxFromId(defaultEnd, minuteStep, hourStep);
    const childrenList = [...ref.current.children];
    if (defaultBeginIdx < defaultEndIdx) {
      cover = childrenList.slice(indexOffSet + defaultBeginIdx, indexOffSet + defaultEndIdx + 1);
      first = cover.shift();
      last = cover.pop();
    } else if (defaultBeginIdx > defaultEndIdx && crossDays) {
      childrenList[indexOffSet + defaultEndIdx].firstChild.innerText = childrenList[indexOffSet + defaultEndIdx].dataset.tooltip + nextDay;
      childrenList[indexOffSet + defaultBeginIdx].firstChild.innerText = childrenList[indexOffSet + defaultBeginIdx].dataset.tooltip + previousDay;
      cover = childrenList.slice(indexOffSet, indexOffSet + defaultEndIdx)
        .concat(childrenList.slice(indexOffSet + defaultBeginIdx + 1, childrenList.length));
      first = childrenList[indexOffSet + defaultEndIdx];
      last = childrenList[indexOffSet + defaultBeginIdx];
    } else if (defaultBeginIdx === defaultEndIdx) {
      cover = [];
      first = last = childrenList[indexOffSet + defaultBeginIdx];
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
    visible && (headerRef.current.style.width = `${timePickerRef.current.scrollWidth - 26}px`);
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
        display: `${visible ? 'flex' : 'none'}`,
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
      <div
        className={styles.container}
        ref={ref}
        style={{
          width: `${Number.parseInt(width, 10) - 16}px`,
          filter: pickerBlur,
          gridTemplateColumns: `repeat(${Math.ceil(60 / minuteStep) + 1}, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(24 / hourStep) + 1}, 1fr)`,
        }}
      >
        {index.concat(timePoint)}
      </div>
      {
    confirmModal && (
      <div
        className={styles.mask}
        ref={maskRef}
        style={{
          visibility: showConfirm ? 'visible' : 'hidden',
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
  maxWidth: propTypes.number,
  maxHeight: propTypes.number,
  position: propTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
  size: propTypes.oneOf(['small', 'medium', 'big']).isRequired,
  confirmModal: propTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  positionRef: propTypes.object.isRequired,
  visible: propTypes.bool.isRequired,
  setVisible: propTypes.func.isRequired,
  defaultValue: propTypes.arrayOf(propTypes.instanceOf(moment)).isRequired,
  onValueChange: propTypes.func.isRequired,
  height: propTypes.number,
  width: propTypes.number,
  fontSize: propTypes.number,
  minuteStep: propTypes.number.isRequired,
  hourStep: propTypes.number.isRequired,
};

TimePicker.defaultProps = {
  maxHeight: undefined,
  maxWidth: undefined,
  width: undefined,
  height: undefined,
  fontSize: undefined,
};
