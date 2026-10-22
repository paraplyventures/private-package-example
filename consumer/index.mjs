import assert from 'node:assert/strict';
import { hello } from '@your-scope/hello-private';
assert.equal(hello(), 'Hello from my private package!');
console.log(hello());
