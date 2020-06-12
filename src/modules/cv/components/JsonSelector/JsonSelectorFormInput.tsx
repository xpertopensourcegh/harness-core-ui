import React from 'react';
import { connect } from 'formik';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import JsonSelector from './JsonSelector';
import { FormGroup, Dialog, Icon } from '@blueprintjs/core';
import { useModalHook } from '@wings-software/uikit';
import classnames from 'classnames';
import css from './JsonSelectorFormInput.module.scss';

interface JsonSelectorFormInputProps {
  name: string,
  label: string,
  json?: object | null
}

const JsonSelectorFormInput = (props: JsonSelectorFormInputProps & {formik?: any}) => {
  const {
    name,
    label,
    json,
    formik
  } = props;

  const value = get(formik.values, name);
  const onPathSelect = (path: string) => {
    hideModal();
    formik.setFieldValue(name, path);
  }

  const onOpenModal = () => {
    if (!isEmpty(json)) {
      openModal();
    }
  }

  const [openModal, hideModal] = useModalHook(() => (
    <Dialog
      isOpen
      usePortal
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose
      enforceFocus
      onClose={hideModal}
      style={{ width: 1200, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }}>
      <div className={css.dialogContent}>
        <div className={css.leftColumn}>Select service <br/> instance provider</div>
        <JsonSelector
          className={css.rightColumn}
          json={json || {}}
          onPathSelect={onPathSelect} />
      </div>
    </Dialog>
  ), [json]);

  return (
    <FormGroup labelFor={name} label={label}>
      <div className={classnames('bp3-input-group', css.inputGroup)}>
        <div className={classnames('bp3-input', css.input)} onClick={onOpenModal}>{value}</div>
        <Icon className={css.inputIcon} icon="plus" iconSize={12} />
      </div>
    </FormGroup>
  );
}

export default connect(JsonSelectorFormInput);
