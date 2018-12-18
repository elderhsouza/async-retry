const axios = require('axios');
const async = require('async');
const delay = require('lodash/delay');

const asyncFun = fun => {
  console.log('asyncFun 1');
  return new Promise(resolve =>
    delay(() => {
      console.log('asyncFun 2');
      setTimeout(resolve.bind(null, 'funfun'), 2000);
    }, 2000)
  );
};

const retry = () => {
  const maxTries = 10;
  const total = 20;
  const interval = 5000;

  let retries = 0;
  let lastValue = null;
  let currentValue = 0;

  return new Promise((resolve, reject) => {
    async.doUntil(
      async () => {
        const response = await asyncFun();
        console.log('fetch', response);
        currentValue = Math.min(currentValue + 5, 15);
        // currentValue = currentValue + 5;
        if (lastValue === currentValue) {
          // console.log('stuck in', currentValue);
          retries = retries + 1;
          if (retries === maxTries) {
            // console.log('max retries reached');
            throw new Error('max retries reached');
          }
        }
        lastValue = currentValue;
        console.log(total, lastValue, currentValue);
        return currentValue;
      },
      () => total === currentValue,
      (err, results) => {
        console.log('callback', err, results);
        return err ? reject(err) : resolve(results);
      }
    );
  });
};

const init = async () => {
  console.log('init');

  try {
    const response = await retry();
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};

init();
