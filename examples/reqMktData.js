var util = require('util');

var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['tickEFP', 'tickGeneric', 'tickOptionComputation', 'tickPrice',
        'tickSize', 'tickString'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('tickEFP', function (tickerId, tickType, basisPoints, formattedBasisPoints,
                           impliedFuturesPrice, holdDays, futureExpiry, dividendImpact,
                           dividendsToExpiry) {
  console.log(
    '%s %s%d %s%d %s%s %s%d %s%d %s%s %s%d %s%d',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
    chalk.bold('tickerId='), tickerId,
    chalk.bold('basisPoints='), basisPoints,
    chalk.bold('formattedBasisPoints='), formattedBasisPoints,
    chalk.bold('impliedFuturesPrice='), impliedFuturesPrice,
    chalk.bold('holdDays='), holdDays,
    chalk.bold('futureExpiry='), futureExpiry,
    chalk.bold('dividendImpact='), dividendImpact,
    chalk.bold('dividendsToExpiry='), dividendsToExpiry
  );
}).on('tickGeneric', function (tickerId, tickType, value) {
  console.log(
    '%s %s%d %s%d',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
    chalk.bold('tickerId='), tickerId,
    chalk.bold('value='), value
  );
}).on('tickOptionComputation', function (tickerId, tickType, impliedVol, delta, optPrice,
                                         pvDividend, gamma, vega, theta, undPrice) {
  console.log(
    '%s %s%d %s%s %s%s %s%s %s%d %s%s %s%s %s%s %s%d',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
    chalk.bold('tickerId='), tickerId,
    chalk.bold('impliedVol='), ib.util.numberToString(impliedVol),
    chalk.bold('delta='), ib.util.numberToString(delta),
    chalk.bold('optPrice='), ib.util.numberToString(optPrice),
    chalk.bold('pvDividend='), pvDividend,
    chalk.bold('gamma='), ib.util.numberToString(gamma),
    chalk.bold('vega='), ib.util.numberToString(vega),
    chalk.bold('theta='), ib.util.numberToString(theta),
    chalk.bold('undPrice='), undPrice
  );
}).on('tickPrice', function (tickerId, tickType, price, canAutoExecute) {
  console.log(
    '%s %s%d %s%d %s%s',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
    chalk.bold('tickerId='), tickerId,
    chalk.bold('price='), price,
    chalk.bold('canAutoExecute='), canAutoExecute
  );
}).on('tickSize', function (tickerId, sizeTickType, size) {
  console.log(
    '%s %s%d %s%d',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(sizeTickType))),
    chalk.bold('tickerId:'), tickerId,
    chalk.bold('size:'), size
  );
}).on('tickString', function (tickerId, tickType, value) {
  console.log(
    '%s %s%d %s%s',
    chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
    chalk.bold('tickerId='), tickerId,
    chalk.bold('value='), value
  );
});

ib.connect();

// Forex
ib.reqMktData(1, ib.contract.forex('EUR'), '', false, false);
ib.reqMktData(2, ib.contract.forex('GBP'), '', false, false);
ib.reqMktData(3, ib.contract.forex('CAD'), '', false, false);
ib.reqMktData(4, ib.contract.forex('HKD'), '', false, false);
ib.reqMktData(5, ib.contract.forex('JPY'), '', false, false);
ib.reqMktData(6, ib.contract.forex('KRW'), '', false, false);

// Stock
ib.reqMktData(11, ib.contract.stock('AAPL'), '', false, false);
ib.reqMktData(12, ib.contract.stock('AMZN'), '', false, false);
ib.reqMktData(13, ib.contract.stock('GOOG'), '', false, false);
ib.reqMktData(14, ib.contract.stock('FB'), '', false, false);

// Option
ib.reqMktData(21, ib.contract.option('AAPL', '201712', 200, 'C'), '', false, false);
ib.reqMktData(22, ib.contract.option('AMZN', '201712', 900, 'P'), '', false, false);
ib.reqMktData(23, ib.contract.option('GOOG', '201712', 1000, 'C'), '', false, false);
ib.reqMktData(24, ib.contract.option('FB', '201712', 150, 'P'), '', false, false);

// Future
ib.reqMktData(25, ib.contract.future('ES', '201712', 'USD', 'GLOBEX'), '', false, false);

// Disconnect after 7 seconds.
setTimeout(function () {
  console.log(chalk.yellow('Cancelling market data subscription...'));

  // Forex
  ib.cancelMktData(1);
  ib.cancelMktData(2);
  ib.cancelMktData(3);
  ib.cancelMktData(4);
  ib.cancelMktData(5);
  ib.cancelMktData(6);

  //Stock
  ib.cancelMktData(11);
  ib.cancelMktData(12);
  ib.cancelMktData(13);
  ib.cancelMktData(14);

  // Option
  ib.cancelMktData(21);
  ib.cancelMktData(22);
  ib.cancelMktData(23);
  ib.cancelMktData(24);

  // Future
  ib.cancelMktData(25);

  ib.disconnect();
}, 7000);
