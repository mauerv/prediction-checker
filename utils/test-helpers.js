function assertLogs(logs, eventListened, propertyName, expected, message) {
    for (let i = 0; i < logs.length; i++) {
        let log = logs[i];

        if (log.event == eventListened) {
            expectedValue = expected;
            return assert(Number(log.args[propertyName]) === expectedValue, message);
            break;
        }
    }
}

module.exports = {
    assertLogs: assertLogs
}
