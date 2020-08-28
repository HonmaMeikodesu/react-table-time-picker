/* eslint-disable no-unused-expressions */
import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import moment from 'moment';
import TimePicker from 'components/time-picker';

const styleSheetUUID = 'e313afea-95c8-4227-812f-7606571bd6a6';

const ele = document.createElement('div');
const eleStyle = ['absolute', '0px', '0px', '100%'];
['position', 'left', 'top', 'width'].forEach((key, idx) => ele.style[key] = eleStyle[idx]);
document.body.appendChild(ele);

export default function TimePickerAttachment({
  size, zIndex, attachElement, maxHeight, maxWidth, position, defaultValue, onValueChange,
  originColor, includedColor, selectedColor, confirmModal,
}) {
  const [visible, setVisible] = useState(false);
  const positionRef = useRef(null);
  const container = useMemo(() => React.cloneElement(attachElement, { onClick: () => setVisible(true), ref: positionRef }), [attachElement]);

  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('id', 'e313afea-95c8-4227-812f-7606571bd6a6');
    document.body.appendChild(style);
    style.sheet.insertRule(`:root {
    --cell-${styleSheetUUID}: ${originColor};
    --cell-included-${styleSheetUUID}: ${includedColor};
    --cell-selected-${styleSheetUUID}: ${selectedColor};
    );
    }`);
    return () => {
      document.getElementById('e313afea-95c8-4227-812f-7606571bd6a6').remove();
    };
  }, [includedColor, originColor, selectedColor]);

  useEffect(() => {
    ReactDOM.render(
      <TimePicker
        size={size}
        zIndex={zIndex}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        position={position}
        confirmModal={confirmModal}
        visible={visible}
        setVisible={setVisible}
        positionRef={positionRef}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      />,
      ele,
    );
    return () => {
    };
  }, [confirmModal, maxHeight, maxWidth, position, size, visible, zIndex]);
  return (
    <>
      {container}
    </>
  );
}

TimePickerAttachment.propTypes = {
  attachElement: propTypes.element.isRequired,
  originColor: propTypes.string,
  includedColor: propTypes.string,
  selectedColor: propTypes.string,
  zIndex: propTypes.number,
  maxWidth: propTypes.number,
  maxHeight: propTypes.number,
  position: propTypes.oneOf(['top', 'right', 'bottom', 'left']),
  size: propTypes.oneOf(['small', 'medium', 'big']),
  confirmModal: propTypes.bool,
  defaultValue: propTypes.arrayOf(propTypes.instanceOf(moment)),
  onValueChange: propTypes.func,
};
TimePickerAttachment.defaultProps = {
  originColor: '#66ccff',
  includedColor: 'rgba(102, 204, 255, 0.5)',
  selectedColor: '#458bad',
  zIndex: 1,
  maxWidth: undefined,
  maxHeight: undefined,
  size: 'small',
  position: 'bottom',
  confirmModal: true,
  defaultValue: [moment(), moment()],
  onValueChange: () => {},
};
