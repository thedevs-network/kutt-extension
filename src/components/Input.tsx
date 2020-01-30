/* eslint-disable no-nested-ternary */
import React from 'react';

type SelectFieldOptionPropeties = {
    option: string;
    value: string;
    disabled?: boolean | undefined;
};

export const SelectField = ({ options, label, field, form: { touched, errors }, ...props }): JSX.Element => {
    return (
        <>
            <label htmlFor={field.name}>{label}</label>
            <select {...field} {...props}>
                {options.map(({ option, value, disabled = false }: SelectFieldOptionPropeties, index: number) => {
                    return (
                        <option value={value} disabled={disabled} key={index}>
                            {option}
                        </option>
                    );
                })}
            </select>

            {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
        </>
    );
};

export const TextField = ({ label, field, form: { touched, errors }, ...props }): JSX.Element => {
    return (
        <>
            <label htmlFor={field.name}>{label}</label>
            <input {...field} {...props} />

            {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
        </>
    );
};
