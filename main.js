"use strict";

var L = require("library");

var modules = {
    characterSets: require("character-sets"),
    period: require("period"),
    namedNumber: require("named-number"),
    checker: require("checker")
};

var defaults = {
    calculationsPerSecond: 1e10, // 10 billion
    good: 31557600e6, // 1 million years
    ok: 31557600 // 1 year
};

var options = {};

var hsimp = function (password) {
    var self = {};

    var characterSets = modules.characterSets(password);
    var possibleCharacters = characterSets.getPossibleCharacters();

    var possibleCombinations = Math.pow(possibleCharacters, password.length);
    var timeInSeconds = possibleCombinations / options.calculationsPerSecond;

    var period = modules.period(timeInSeconds);
    var periodLength = period.getLength();
    var formattedPeriodLength = modules.namedNumber(periodLength).getName();
    var periodName = formattedPeriodLength === "1" ? period.getSingular() : period.getPlural();

    var periodString = formattedPeriodLength + " " + periodName;

    var checker =  modules.checker(password);
    var checks = checker.getChecks();

    self.getChecks = L.output(checks);

    var securityLevel = "bad";

    if (checker.isInsecure()) {
        securityLevel = "insecure";
        timeInSeconds = 0;
        periodString = "Instantly";
    } else if (timeInSeconds >= options.good) {
        if (checker.hasWarnings()) {
            securityLevel = "ok";
        } else {
            securityLevel = "good";
        }
    } else if (timeInSeconds >= options.ok) {
        securityLevel = "ok";
    }

    self.getSecurityLevel = L.output(securityLevel);

    self.getPossibleCombinations = L.output(possibleCombinations);
    self.getTimeInSeconds = L.output(timeInSeconds);
    self.getString = L.output(periodString);
    self.getTimeString = L.output(periodString);

    return self;
};

hsimp.setPeriodDictionary = modules.period.setDictionary;
hsimp.setNamedNumberDictionary = modules.namedNumber.setDictionary;
hsimp.setCheckerDictionary = modules.checker.setDictionary;

hsimp.setOptions = function (opts) {
    options = L.defaults(defaults, opts);
};

hsimp.setOptions(defaults);

module.exports = hsimp;