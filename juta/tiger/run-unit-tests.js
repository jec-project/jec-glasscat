"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_tiger_1 = require("jec-tiger");
const factory = new jec_tiger_1.TigerFactory();
const tiger = factory.create();
tiger.process((stats) => {
    if (stats.error)
        console.error(stats.error);
    else {
        console.log(`Test stats:
- test lookup process duration: ${stats.time}
- number of test suites: ${stats.numTestSuites}
- number of disabled test suites: ${stats.numDisabledTestSuites}
- number of synchronous test cases: ${stats.numTests}
- number of asynchronous test cases: ${stats.numAsyncTests}
- number of disabled test cases: ${stats.numDisabledTests}`);
    }
});
