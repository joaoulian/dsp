// Vendors
import { each, sum, map, mean } from 'lodash';

// Locals
import { ccof_bwbp, dcof_bwbp, sf_bwbp } from './utils/butter';

export function butter(order, WcA, WcB) {
  const dcof = dcof_bwbp(order, WcA, WcB);
  const ccof = ccof_bwbp(order);
  const sf = sf_bwbp(order, WcA, WcB);

  const c = ccof.map(info => info * sf);

  const A = dcof.slice(0, 2 * order + 1);
  const B = c.slice(0, 2 * order + 1);

  const response = {
    A: A,
    B: B
  };
  return response;
}

export function derivated(array) {
  let arrayDerivated = [];
  for (let i = 1; i < array.length; i++) {
    arrayDerivated.push(array[i] - array[i - 1]);
  }
  return arrayDerivated;
}

export function findAllPeaks(array) {
  // instantiate an array as result
  let result = [];
  // iterate over input
  each(array, function(val, key, col) {
    // check left and right neighbors
    if (col[key + 1] < val && col[key - 1] < val) {
      // add information to results array
      result.push(key);
    }
  });
  // ternary check: if results array is not empty give result array, else give false
  return result.length ? result : false;
}

export function PDetect(array, window, factor, influence) {
  let filtered = array.slice();
  let stdFilter = Array.apply(null, Array(array.length)).map(function() {});
  let avgFilter = Array.apply(null, Array(array.length)).map(function() {});
  let peaks = [];

  const delayArray = array.slice(0, window);
  stdFilter[window - 1] = σ(delayArray);
  avgFilter[window - 1] = _.mean(delayArray);

  let firstIteration = false;
  let peak = false;
  for (let i = window; i < array.length; i++) {
    if (Math.abs(array[i] - avgFilter[i - 1]) > factor * stdFilter[i - 1]) {
      if (array[i] > avgFilter[i - 1] && !peak) {
        if (array[i] >= array[i - 1] && array[i] >= array[i + 1]) {
          peaks.push(i);
          peak = true;
        } else {
          peak = false;
        }
      } else {
        peak = false;
      }
      filtered[i] = influence * array[i] + (1 - influence) * array[i - 1];
    } else {
      peak = false;
    }
    const filteredSubArray = filtered.slice(i - window, i + 1);
    avgFilter[i] = mean(filteredSubArray);
    stdFilter[i] = σ(filteredSubArray);
  }

  const response = {
    stdFilter: stdFilter,
    avgFilter: avgFilter,
    filtered: filtered,
    peaks: peaks
  };
  return response;
}

export function σ(array) {
  var avg = sum(array) / array.length;
  return Math.sqrt(sum(map(array, i => Math.pow(i - avg, 2))) / array.length);
}

export function PTDetect(x, E) {
  let P = [],
    T = [],
    a = 1,
    b = 1,
    d = 0;

  for (let i = 0; i < x.length; i++) {
    if (d == 0) {
      if (x[a] >= x[i] + E) {
        d = 2;
      } else if (x[i] >= x[b] + E) {
        d = 1;
      }
      if (x[a] <= x[i]) {
        a = i;
      } else if (x[i] <= x[b]) {
        b = i;
      }
    } else if (d == 1) {
      if (x[a] <= x[i]) {
        a = i;
      } else if (x[a] >= x[i] + E) {
        P.push(a);
        b = i;
        d = 2;
      }
    } else if (d == 2) {
      if (x[i] <= x[b]) {
        b = i;
      } else if (x[i] >= x[b] + E) {
        T.push(b);
        a = i;
        d = 1;
      }
    }
  }
  return P;
}

export function filter(b, a, signal) {
  var result = Array.apply(null, Array(signal.length)).map(
    Number.prototype.valueOf,
    0
  );

  for (var i = 0; i < signal.length; i++) {
    var tmp = 0;

    for (var j = 0; j < b.length; j++) {
      if (i - j < 0) {
        break;
      }
      tmp += b[j] * signal[i - j];
    }
    for (var j = 1; j < a.length; j++) {
      if (i - j < 0) {
        break;
      }
      tmp -= a[j] * result[i - j];
    }
    tmp /= a[0];
    result[i] = tmp;
  }
  return result;
}

export function getSampleRate(instants) {
  const period = mean(derivated(instants)) / 1000;
  const sampleRate = 1 / period;
  return sampleRate;
}
