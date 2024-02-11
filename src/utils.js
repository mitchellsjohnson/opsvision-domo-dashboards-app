const padToNDigits = (num, pad) => num.toString().padStart(pad, '0');

const formatDate = (date, pad) => (`${padToNDigits(date.getMonth() + 1, pad)}/
${padToNDigits(date.getDate(), pad)}/
${date.getFullYear()} ${padToNDigits(date.getHours(), pad)}:${padToNDigits(date.getMinutes(), pad)}:${padToNDigits(date.getSeconds(), pad)}`
);

export default {
  dateFunctions: {
    padToNDigits,
    formatDate,
  },
};
