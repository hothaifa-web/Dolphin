const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');

const files = glob.sync('src/**/*.jsx', { nodir: true });
console.log('Found', files.length, '.jsx files');
let had=false;
for(const f of files){
  try{
    const code = fs.readFileSync(f,'utf8');
    parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  }catch(e){
    console.error('ERROR in', f);
    console.error(e.message);
    console.error('---');
    had=true;
  }
}
if(!had) console.log('No parse errors found');
