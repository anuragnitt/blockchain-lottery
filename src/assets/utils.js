import { web3 } from './contract';

export const toEther = (num) => {
    return web3.utils.fromWei(num, 'ether').match(/^-?\d+(?:\.\d{0,5})?/)[0];
}

export const TextFieldSX = {
    '& .MuiFormLabel-root': {
        color: '#b9bab8'
    },
    '& label.Mui-focused': {
        color: '#00ff00'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#b9bab8'
        }
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#b9bab8',
        },
        '&:hover fieldset': {
            borderColor: '#b9bab8',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'green',
        },
    },
    '& .MuiInputBase-input': {
        'font-family': 'Courier New',
        color: '#ffffff'
    }
};
