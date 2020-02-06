/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect, FormikContextType } from 'formik';
import { useRef, useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';

interface FormikPartProperties {
    formik: FormikContextType<any>;
}

interface OuterProperties {
    onSave: (values: any) => Promise<any>;
    render: any;
}

const usePrevious = (value: any): any => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

/**
 *  @returns boolean
 *
 *  Wrapping with formik HOC can give access to form values.
 *  It calls the passed callback with form values as arguments.
 *
 *  Ref: https://github.com/jaredpalmer/formik/issues/172#issuecomment-528192124
 */
const AutoSave = ({ formik: { values }, onSave, render }: OuterProperties & FormikPartProperties): any => {
    const previousValues = usePrevious(values);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        function callback(value: any): any {
            // promise fulfilled
            setIsSaving(false);

            return value;
        }

        function save(): void {
            if (previousValues && Object.keys(previousValues).length && !isEqual(previousValues, values)) {
                // values are updated
                setIsSaving(true);
                // invoke passed promise callback
                onSave(values).then(callback, callback);
            }
        }

        save();
    }, [onSave, previousValues, values]);

    return render({ isSaving });
};

export default connect<OuterProperties, any>(AutoSave);
