const actions = require('./../action/logs.js');
const model = require('./../model/logs.js');

test('1. init logs data', () => {
  expect(model()).toEqual({
    logs: []
  })
})

test('2. add new log into empty logs', () => {
  const newState = model(undefined, {
    type: actions.addLogs,
    data: "Test new log"
  });

  expect({
    value: newState.logs[0].value,
    len: newState.logs.length
  }).toEqual({
    value: "Test new log",
    len: 1
  });
})

test('3. add new log into logs', () => {
  const newState = model({logs: [{time: '00:00:00', value: 'the first log'}]}, {
    type: actions.addLogs,
    data: "the second log"
  });

  expect({
    log1: newState.logs[0].value,
    log2: newState.logs[1].value,
    len: newState.logs.length
  }).toEqual({
    log1: "the first log",
    log2: "the second log",
    len: 2
  });
})

test('4. clear all logs', () => {
  const newState = model({ logs: [
    { time: '00:00:00', value: 'log1' }, 
    { time: '00:00:00', value: 'log2' }
    ] }, {
      type: actions.clearLogs
    });

  expect({
    len: newState.logs.length
  }).toEqual({
    len: 0
  });
})