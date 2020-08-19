/* eslint-disable no-unused-expressions */
import React, {
  useState, useCallback, useMemo, useRef, useEffect,
} from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import styles from 'static/index.less';
// eslint-disable-next-line import/no-unresolved
import hint from 'static/hint.svg';

export default function TimePicker({
  size, zIndex, setTime, title, attachElement, maxHeight, maxWidth, position,
}) {
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const positionRef = useRef(null);
  const container = useMemo(() => React.cloneElement(attachElement, { onClick: () => setVisible(true), ref: positionRef }), [attachElement]);
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
        return '350px';
      case 'medium':
        return '500px';
      case 'big':
        return '800px';
      default:
        return '350px';
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

  const containerLeft = useMemo(() => {
    if (!positionRef.current) return;
    const hitArea = positionRef.current.getBoundingClientRect(); // scroll bar is not includingly calculated here
    const tweakWidth = maxWidth ? maxWidth < Number.parseInt(width, 10) ? maxWidth : Number.parseInt(width, 10) : Number.parseInt(width, 10);
    let result = null;
    (position === 'top' || position === 'bottom')
  && (result = `${(hitArea.left + hitArea.right) / 2 - Number.parseInt(tweakWidth, 10) / 2 > 0 ? ((hitArea.left + hitArea.right) / 2 - Number.parseInt(tweakWidth, 10) / 2) : 0}px`);
    position === 'left'
  && (result = `${hitArea.left - Number.parseInt(tweakWidth, 10) > 0 ? (hitArea.left - Number.parseInt(tweakWidth, 10)) : 0}px`);
    position === 'right'
  && (result = `${hitArea.right}px`);
    return result;
  }, [positionRef.current]);

  const containerTop = useMemo(() => {
    if (!positionRef.current) return;
    const hitArea = positionRef.current.getBoundingClientRect();
    const tweakHeight = maxHeight ? maxHeight < Number.parseInt(height, 10) ? maxHeight : Number.parseInt(height, 10) : Number.parseInt(height, 10);
    let result = null;
    (position === 'left' || position === 'right')
  && (result = `${(hitArea.top + hitArea.bottom) / 2 - Number.parseInt(tweakHeight, 10) / 2 > 0 ? ((hitArea.top + hitArea.bottom) / 2 - Number.parseInt(tweakHeight, 10) / 2) : 0}px`);
    position === 'top'
  && (result = `${hitArea.top - Number.parseInt(tweakHeight, 10) > 0 ? (hitArea.top - Number.parseInt(tweakHeight, 10)) : 0}px`);
    position === 'bottom'
  && (result = `${hitArea.bottom}px`);
    return result;
  }, [positionRef.current]);

  const handleCellClick = useCallback((e) => {
    e.preventDefault();
    const { target } = e;
    const indexOffSet = index.length;
    let nextSelectedCell = selectedRange.map((v) => v);
    if (selectedRange[0] !== null && selectedRange[1] !== null) {
      nextSelectedCell = [null, null];
      nextSelectedCell[0] = target.dataset.id;
      let recover = [];
      if (Number.parseInt(selectedRange[0], 10) < Number.parseInt(selectedRange[1], 10)) {
        recover = [...ref.current.children].slice(indexOffSet + Number.parseInt(selectedRange[0], 10), indexOffSet + Number.parseInt(selectedRange[1], 10) + 1);
      } else if (Number.parseInt(selectedRange[0], 10) > Number.parseInt(selectedRange[1], 10)) {
        recover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(selectedRange[1], 10) + 1)
          .concat([...ref.current.children].slice(indexOffSet + Number.parseInt(selectedRange[0], 10), [...ref.current.children].length));
      } else recover = [[...ref.current.children][indexOffSet + Number.parseInt(selectedRange[0], 10)]];
      recover.forEach((cell) => cell.className = styles.cell);
      target.className = styles['cell-selected'];
    } else if (selectedRange[0] !== null) {
      nextSelectedCell[1] = target.dataset.id;
      let cover; let first; let last;
      if (Number.parseInt(nextSelectedCell[1], 10) > Number.parseInt(nextSelectedCell[0], 10)) {
        cover = [...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0], 10), indexOffSet + Number.parseInt(nextSelectedCell[1], 10) + 1);
        first = cover.shift();
        last = cover.pop();
      } else if (Number.parseInt(nextSelectedCell[1], 10) < Number.parseInt(nextSelectedCell[0], 10)) {
        cover = [...ref.current.children].slice(indexOffSet, indexOffSet + Number.parseInt(nextSelectedCell[1], 10))
          .concat([...ref.current.children].slice(indexOffSet + Number.parseInt(nextSelectedCell[0], 10) + 1, [...ref.current.children].length));
        first = [...ref.current.children][indexOffSet + Number.parseInt(nextSelectedCell[1], 10)];
        last = [...ref.current.children][indexOffSet + Number.parseInt(selectedRange[0], 10)];
      } else {
        cover = [];
        first = last = {};
      }
      first.className = last.className = styles['cell-selected'];
      cover.forEach((cell) => cell.className = styles['cell-included']);
      setVisible(false);
    } else {
      nextSelectedCell[0] = target.dataset.id;
      target.className = styles['cell-selected'];
    }
    setSelectedRange(nextSelectedCell);
    const beginRes = Number.parseInt(nextSelectedCell[0], 10);
    const endRes = Number.parseInt(nextSelectedCell[1], 10);
    const begin = beginRes >= 0 ? `${Math.floor(beginRes / 60)}:${beginRes % 60 < 10 ? '0'.concat(beginRes % 60) : beginRes % 60}` : '';
    const end = endRes >= 0 ? `${Math.floor(endRes / 60)}:${endRes % 60 < 10 ? '0'.concat(endRes % 60) : endRes % 60}` : '';
    setTime(`${begin}-${end}`);
  }, [selectedRange, index]);

  const handleHoverHighLight = useCallback((e, flag) => {
    e.preventDefault();
    const indexOffset = index.length;
    const imgOffset = 1;
    const columnOffset = 60;
    const highLightColumnIndex = ref.current.children[imgOffset + (e.target.dataset.id % 60)];
    const highLightRowIndex = ref.current.children[imgOffset + columnOffset + Math.floor(e.target.dataset.id / 60)];
    highLightColumnIndex.className = highLightRowIndex.className = flag ? styles['index-hover'] : styles.index;
    if (selectedRange[0] !== null && selectedRange[1] === null) {
      let cover = [];
      if (Number.parseInt(e.target.dataset.id, 10) > Number.parseInt(selectedRange[0], 10)) {
        cover = [...ref.current.children].slice(indexOffset + Number.parseInt(selectedRange[0], 10) + 1, indexOffset + Number.parseInt(e.target.dataset.id, 10));
      } else if (Number.parseInt(e.target.dataset.id, 10) < Number.parseInt(selectedRange[0], 10)) {
        cover = [...ref.current.children].slice(indexOffset, indexOffset + Number.parseInt(e.target.dataset.id, 10))
          .concat([...ref.current.children].slice(indexOffset + Number.parseInt(selectedRange[0], 10) + 1, [...ref.current.children].length));
      } else cover = [];
      cover.forEach((cell) => cell.className = flag ? styles['cell-included'] : styles.cell);
    }
  }, [selectedRange, index]);

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
            onMouseEnter={(e) => handleHoverHighLight(e, true)}
            onMouseLeave={(e) => handleHoverHighLight(e)}
          />,
        );
      }
    }
    return arr;
  }, [handleCellClick, handleHoverHighLight]);

  useEffect(() => {
    let clear;
    document.addEventListener('click', clear = (e) => {
      if (!ref.current.contains(e.target) && e.target !== positionRef.current) { setVisible(false); }
    });
    return () => {
      document.removeEventListener('click', clear);
    };
  }, []);
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
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          maxWidth: maxWidth ? `${maxWidth}px` : undefined,
          left: containerLeft,
          top: containerTop,
          display: `${visible ? 'block' : 'none'}`,
        }}
      >
        <div className={styles.header}>{title}</div>
        {/* prevent unneccessary scrollbar appears due to grid overlay */}
        <div className={styles.container} ref={ref} style={{ width: Number.parseInt(width, 10) - 10 }}>
          {index.concat(timePoint)}
        </div>
      </div>
      )}

    </>

  );
}

TimePicker.propTypes = {
  zIndex: propTypes.number,
  maxWidth: propTypes.number,
  maxHeight: propTypes.number,
  position: propTypes.oneOf(['top', 'right', 'bottom', 'left']),
  setTime: propTypes.func.isRequired,
  size: propTypes.oneOf(['small', 'medium', 'big']),
  title: propTypes.string,
  attachElement: propTypes.element.isRequired,
};
TimePicker.defaultProps = {
  zIndex: 1,
  maxWidth: undefined,
  maxHeight: undefined,
  size: 'medium',
  title: 'react time picker',
  position: 'bottom',
};
