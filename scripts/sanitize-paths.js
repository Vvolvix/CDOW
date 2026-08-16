const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '..', 'public', 'js'),
  path.join(__dirname, '..', 'js'),
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) return;
  fs.readdirSync(d).forEach(f => {
    if (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.css')) {
      const p = path.join(d, f);
      if (fs.statSync(p).isFile()) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.split("'/img/").join("'img/");
        content = content.split('"/img/').join('"img/');
        content = content.split('`/img/').join('`img/');
        content = content.split("'/css/").join("'css/");
        content = content.split('"/css/').join('"css/');
        content = content.split("'/sound/").join("'sound/");
        content = content.split('"/sound/').join('"sound/');
        fs.writeFileSync(p, content, 'utf8');
      }
    }
  });
});

console.log('Sanitized all paths to relative!');
