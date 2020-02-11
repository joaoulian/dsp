export function dcof_bwbp(n, f1f, f2f) {
  const cp = Math.cos((Math.PI * (f2f + f1f)) / 2);
  const theta = (Math.PI * (f2f - f1f)) / 2;
  const st = Math.sin(theta);
  const ct = Math.cos(theta);
  const s2t = 2 * st * ct;
  const c2t = 2 * ct * ct - 1;

  let rcof = Array.apply(null, Array(2 * n)).map(Number.prototype.valueOf, 0);
  let tcof = Array.apply(null, Array(2 * n)).map(Number.prototype.valueOf, 0);

  for (let k = 0; k < n; k++) {
    const parg = Math.PI * ((2 * k + 1) / (2 * n));
    const sparg = Math.sin(parg);
    const cparg = Math.cos(parg);
    const a = 1 + s2t * sparg;

    rcof[2 * k] = c2t / a;
    rcof[2 * k + 1] = (s2t * cparg) / a;
    tcof[2 * k] = (-2 * cp * (ct + st * sparg)) / a;
    tcof[2 * k + 1] = (-2 * cp * st * cparg) / a;
  }
  let dcof = trimonial_mult(n, tcof, rcof);

  dcof[1] = dcof[0];
  dcof[0] = 1;
  for (let k = 3; k <= 2 * n; k++) {
    dcof[k] = dcof[2 * k - 2];
  }
  return dcof;
}

export function ccof_bwbp(n) {
  let ccof = Array.apply(null, Array(2 * n + 1)).map(
    Number.prototype.valueOf,
    0
  );

  let tcof = ccof_bwhp(n);
  for (let i = 0; i < n; i++) {
    ccof[2 * i] = tcof[i];
    ccof[2 * i + 1] = 0;
  }
  ccof[2 * n] = tcof[n];
  return ccof;
}

export function ccof_bwhp(n) {
  let ccof = ccof_bwlp(n);
  for (let i = 0; i <= n; i++) {
    if (i % 2) ccof[i] = -ccof[i];
  }
  return ccof;
}

export function ccof_bwlp(n) {
  let ccof = Array.apply(null, Array(n + 1)).map(Number.prototype.valueOf, 0);

  ccof[0] = 1;
  ccof[1] = n;
  let m = n / 2;
  for (let i = 2; i <= m; i++) {
    ccof[i] = ((n - i + 1) * ccof[i - 1]) / i;
    ccof[n - i] = ccof[i];
  }
  ccof[n - 1] = n;
  ccof[n] = 1;
  return ccof;
}

export function trimonial_mult(n, b, c) {
  let a = Array.apply(null, Array(n * 4)).map(Number.prototype.valueOf, 0);
  a[2] = c[0];
  a[3] = c[1];
  a[0] = b[0];
  a[1] = b[1];

  for (let i = 1; i < n; i++) {
    a[2 * (2 * i + 1)] +=
      c[2 * i] * a[2 * (2 * i - 1)] - c[2 * i + 1] * a[2 * (2 * i - 1) + 1];
    a[2 * (2 * i + 1) + 1] +=
      c[2 * i] * a[2 * (2 * i - 1) + 1] + c[2 * i + 1] * a[2 * (2 * i - 1)];

    for (let j = 2 * i; j > 1; j--) {
      a[2 * j] +=
        b[2 * i] * a[2 * (j - 1)] -
        b[2 * i + 1] * a[2 * (j - 1) + 1] +
        c[2 * i] * a[2 * (j - 2)] -
        c[2 * i + 1] * a[2 * (j - 2) + 1];
      a[2 * j + 1] +=
        b[2 * i] * a[2 * (j - 1) + 1] +
        b[2 * i + 1] * a[2 * (j - 1)] +
        c[2 * i] * a[2 * (j - 2) + 1] +
        c[2 * i + 1] * a[2 * (j - 2)];
    }

    a[2] += b[2 * i] * a[0] - b[2 * i + 1] * a[1] + c[2 * i];
    a[3] += b[2 * i] * a[1] + b[2 * i + 1] * a[0] + c[2 * i + 1];
    a[0] += b[2 * i];
    a[1] += b[2 * i + 1];
  }
  return a;
}

export function sf_bwbp(n, f1f, f2f) {
  const ctt = 1 / Math.tan((Math.PI * (f2f - f1f)) / 2);
  let sfr = 1;
  let sfi = 0;

  for (let k = 0; k < n; k++) {
    const parg = (Math.PI * (2 * k + 1)) / (2 * n);
    const sparg = ctt + Math.sin(parg);
    const cparg = Math.cos(parg);
    const a = (sfr + sfi) * (sparg - cparg);
    const b = sfr * sparg;
    const c = -sfi * cparg;
    sfr = b - c;
    sfi = a - b - c;
  }
  return 1 / sfr;
}
