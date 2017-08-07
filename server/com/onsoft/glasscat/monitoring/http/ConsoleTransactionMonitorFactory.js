"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_core_1 = require("jec-glasscat-core");
class ConsoleTransactionMonitorFactory {
    constructor() { }
    build() {
        let monitor = new jec_glasscat_core_1.ConsoleTransactionMonitor();
        return monitor;
    }
}
exports.ConsoleTransactionMonitorFactory = ConsoleTransactionMonitorFactory;
