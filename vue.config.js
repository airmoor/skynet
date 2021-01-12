
const webpack = require("webpack");

module.exports = {
    css: {
        extract: {ignoreOrder: true},
        loaderOptions: {
            scss: {
                prependData: `@import "~@/scss/_include.scss";`,
            },
        },
    },

};
