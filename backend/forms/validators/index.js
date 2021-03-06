'use strict';

//Booleans
module.exports.boolTrue = value => value;

//Strings
module.exports.strMinMax = (value, min, max) => value.length >= min && value.length <= max;
module.exports.strMax = (value, max) => value.length <= max;
module.exports.strEquals = (value, str) => value === str;
module.exports.strIsDate = value => /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(value);
module.exports.strIsDatetime = value => !isNaN(Date.parse(value));

//Numbers
module.exports.numType = value => /^-?[0-9]*$/.test(value);
module.exports.numMinMax = (value, min, max) => value >= min && value <= max;
module.exports.numMin = (value, min) => value >= min;
module.exports.numMax = (value, max) => value <= max;

//Floating numbers
module.exports.floatType = value => /^-?[0-9]*(\.[0-9]*)?$/.test(value);

//Dates
module.exports.dateMin = (value, min) => new Date(value) >= new Date(min);
module.exports.dateMax = (value, max) => new Date(value) <= new Date(max);
