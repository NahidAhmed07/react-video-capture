const PassRegex = /^(\d+) \((\d+\.\d+)\)$/;
const FailRegex = /^\d+ \{[^}]+\}$/;
const FailGtTwoRegex = /^\d+ \{[^}]+,\s*$/;
const FailGtFiveRegex =  /^\d{5}(?![^{}]*})(?:[^{}]*,|\s*$)/;
const RemoveFirstAndLastCharRegex = /^.(.*).$/;


export {
    PassRegex, FailRegex, FailGtFiveRegex, FailGtTwoRegex,
    RemoveFirstAndLastCharRegex
}