import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

export const ValidationTextField = (props) => {
    const [text, setText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!props.onChange(text)) {
            text ? setErrorMessage(props.errorMessage) : setErrorMessage("");
            props.setEntityValid(false);
        }
    }, [text]);

    useEffect(() => {
        if (props.onChange(text)) {
            setErrorMessage("");
            props.setEntityValid(true);
        }
    }, [text, errorMessage]);

    return (
        <TextField
            error={!props.onChange(text) && text}
            defaultValue={props.defaultValue}
            label={props.label}
            variant={props.variant}
            sx={props.sx}
            helperText={errorMessage}
            onChange={(e) => setText(e.target.value)}
            value={text}
            inputRef={props.inputRef}
        />
    );
}

export default ValidationTextField;
