'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Custom config section starts here - add handlebars
const loaderRule = {
    "use": [{
    "loader": "handlebars-template-loader"
    }],
    "test": /\.hbs/
    };

// push loader configuration to SPFx configuration
build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.module.rules.push(loaderRule);
    
    return generatedConfiguration;
    }
});

build.initialize(gulp);
