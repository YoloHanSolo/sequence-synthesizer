const seqs = require('../src/data/sequences.json')
const mappings = require('../src/data/mappings.json')

const MATRICES = {
  Pos:    [[1,0,0,0],[1,1,0,0],[1,2,1,0],[1,3,3,1]],
  Neg:    [[-1,0,0,0],[-1,-1,0,0],[-1,-2,-1,0],[-1,-3,-3,-1]],
  DL1:    [[1,0,0,0],[-1,1,0,0],[1,-2,1,0],[-1,3,-3,1]],
  DL0:    [[-1,0,0,0],[1,-1,0,0],[-1,2,-1,0],[1,-3,3,-1]],
  H0:     [[1,0,0,0],[-1,-1,0,0],[1,2,1,0],[-1,-3,-3,-1]],
  H1:     [[-1,0,0,0],[1,1,0,0],[-1,-2,-1,0],[1,3,3,1]],
  V0:     [[-1,0,0,0],[-1,1,0,0],[-1,2,-1,0],[-1,3,-3,1]],
  V1:     [[1,0,0,0],[1,-1,0,0],[1,-2,1,0],[1,-3,3,-1]],
  SeedGen:[[0,0,0,0],[0,1,0,0],[0,2,2,0],[0,0,3,3]],
  P:      [[0,0,0,0],[0,1,0,0],[0,0,2,0],[0,0,0,3]],
  Sierp:  [[1,0,0,0],[1,1,0,0],[1,0,1,0],[1,1,1,1]],
}

function matMul(M, v) { return M.map(r => r.reduce((s,m,c) => s + m*v[c], 0)) }

function AbsDiff(v) {
  const a = [...v], res = [a[0]]
  for (let l = v.length - 1; l > 0; l--) {
    for (let i = 0; i < l; i++) a[i] = Math.abs(a[i+1] - a[i])
    res.push(a[0])
  }
  return res
}

// known infinite formulas
const SEED_IDS = new Set(['zero','s010','n110','cfib','per10','per01','nzero','s0110','s1110','s0120','s01660','s01436'])

function valInf(id, vals, n) {
  if (id === 'per01') return n % 2
  if (id === 'per10') return 1 - n % 2
  if (SEED_IDS.has(id)) return n < vals.length ? vals[n] : 0
  const F = {
    x0:n=>1, x1:n=>n, x2:n=>n*n, x3:n=>n*n*n, x4:n=>n*n*n*n,
    e2x:n=>2**n, e3x:n=>3**n, e4x:n=>4**n,
    ne1x:n=>-1, ne2x:n=>-(2**n), ne3x:n=>-(3**n), ne4x:n=>-(4**n),
    alt1:n=>(-1)**n, alt2:n=>(-1)**n*2**n, alt3:n=>(-1)**n*3**n, alt4:n=>(-1)**n*4**n,
    nalt1:n=>-((-1)**n), nalt2:n=>-((-1)**n)*2**n, nalt3:n=>-((-1)**n)*3**n, nalt4:n=>-((-1)**n)*4**n,
    fib:n=>{ let a=0,b=1; for(let i=0;i<n;i++){let t=a+b;a=b;b=t;} return a },
    fib2:n=>{ let a=0,b=1; for(let i=0;i<n;i++){let t=a+b;a=b;b=t;} return a*a },
    subfact:n=>{ if(n===0)return 1; if(n===1)return 0; let a=1,b=0; for(let i=2;i<=n;i++){let t=(i-1)*(a+b);b=a;a=t;} return a },
    fact:n=>{ let r=1; for(let i=1;i<=n;i++) r*=i; return r },
    primes: null,
  }
  if (F[id] === null) return null
  if (F[id]) return F[id](n)
  if (n < vals.length) return vals[n]
  return null
}

function C(n, k) {
  if (k < 0 || k > n) return 0
  let r = 1
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1)
  return Math.round(r)
}

function infiniteOp(op, srcId, srcVals, n) {
  const v = k => k < srcVals.length ? srcVals[k] : (SEED_IDS.has(srcId) ? 0 : null)
  if (op === 'Pos') return [0,1,2,3].reduce((s,k) => s + C(n,k)*v(k), 0)
  if (op === 'Neg') return -[0,1,2,3].reduce((s,k) => s + C(n,k)*v(k), 0)
  if (op === 'DL1') return [0,1,2,3].reduce((s,k) => s + (-1)**(n-k)*C(n,k)*v(k), 0)
  if (op === 'DL0') return -[0,1,2,3].reduce((s,k) => s + (-1)**(n-k)*C(n,k)*v(k), 0)
  if (op === 'H0')  return (-1)**n * [0,1,2,3].reduce((s,k) => s + C(n,k)*v(k), 0)
  if (op === 'H1')  return -((-1)**n) * [0,1,2,3].reduce((s,k) => s + C(n,k)*v(k), 0)
  if (op === 'V0')  return [0,1,2,3].reduce((s,k) => s + (-1)**(k+1)*C(n,k)*v(k), 0)
  if (op === 'V1')  return -[0,1,2,3].reduce((s,k) => s + (-1)**(k+1)*C(n,k)*v(k), 0)
  if (op === 'Sierp') {
    let sum = 0
    for (let k = 0; k < 4; k++) { if ((n & k) === k) sum += v(k) }
    return sum
  }
  if (op === 'P') return n * (n < srcVals.length ? srcVals[n] : (SEED_IDS.has(srcId) ? 0 : null))
  return null // SeedGen, AbsDiff: skip
}

const nodeMap = Object.fromEntries(seqs.map(s => [s.id, s]))
const ops = ['Pos','Neg','DL1','DL0','H0','H1','V0','V1','SeedGen','P','Sierp','AbsDiff']
const targets = ['s0110','s1110']

const found = []

for (const srcId of targets) {
  const src = nodeMap[srcId]
  for (const op of ops) {
    let result
    try {
      if (op === 'AbsDiff') result = AbsDiff(src.values)
      else result = matMul(MATRICES[op], src.values)
    } catch(e) { continue }

    for (const tgt of seqs) {
      if (tgt.id === srcId) continue
      if (!result.every((v,i) => v === tgt.values[i])) continue

      let infStatus = 'skip'
      if (op !== 'AbsDiff' && op !== 'SeedGen') {
        let ok = true
        for (let n = 4; n <= 12; n++) {
          const tgtN = valInf(tgt.id, tgt.values, n)
          const computed = infiniteOp(op, srcId, src.values, n)
          if (tgtN === null || computed === null) { infStatus = 'skip'; ok = false; break }
          if (computed !== tgtN) { infStatus = 'FAIL'; ok = false; break }
        }
        if (ok) infStatus = 'OK'
      }

      console.log(srcId, '-['+op+']-> '+tgt.id, JSON.stringify(result), 'inf:'+infStatus)
      if (infStatus !== 'FAIL') {
        found.push({ srcId, op, tgtId: tgt.id, result, infStatus })
      }
    }
  }
}

console.log('\n=== VALID EDGES ===')
found.forEach(e => console.log(e.srcId, '-['+e.op+']-> '+e.tgtId, e.infStatus))
