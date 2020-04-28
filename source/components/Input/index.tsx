/* eslint-disable no-nested-ternary */
import React from 'react';
import {FieldProps} from 'formik';

import './styles.scss';

type SelectFieldProperties = {
  options: SelectFieldOptionPropeties[];
  label: string;
};

type SelectFieldOptionPropeties = {
  option: string;
  value: string;
  disabled?: boolean | undefined;
};

export const SelectField: React.FC<SelectFieldProperties & FieldProps> = ({
  options,
  label,
  field,
  form: {touched, errors},
  ...props
}) => {
  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <div style={{padding: '0px'}}>
        <select {...field} {...props}>
          {options.map(
            (
              {option, value, disabled = false}: SelectFieldOptionPropeties,
              index: number
            ) => {
              return (
                <option value={value} disabled={disabled} key={index}>
                  {option}
                </option>
              );
            }
          )}
        </select>
      </div>

      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </>
  );
};

type TextFieldProperties = {
  label: string;
};

export const TextField: React.FC<TextFieldProperties & FieldProps> = ({
  label,
  field,
  form: {touched, errors},
  ...props
}) => {
  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input {...field} {...props} />

      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </>
  );
};

type CheckBoxProperties = {
  label: string;
};

export const CheckBox: React.FC<CheckBoxProperties & FieldProps> = ({
  label,
  field,
  form,
  ...props
}) => {
  return (
    <>
      <label
        htmlFor={field.name}
        className="check__box"
        {...props}
        onChange={(): boolean => {
          // form.setFieldValue(field.name, !field.value);
          return !field.value;
        }}
      >
        <input type="checkbox" checked={field.value} {...field} />
        <div className={`inner ${field.value ? 'checked' : ''}`} />

        <span>{label}</span>
      </label>
    </>
  );
};
