const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'js');

fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.js')) {
    const code = fs.readFileSync(path.join(dir, f), 'utf8');
    const re = /register\(['"]([^'"]+)['"]/g;
    let m, list = [];
    while ((m = re.exec(code)) !== null) {
      list.push(m[1]);
    }
    if (list.length) {
      console.log(f, '=>', list.join(', '));
    }
  }
});
