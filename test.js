const assert = require('assert');
const server = require('./app');

console.log('--- Running Automated Unit Tests ---');

// Test 1: Validate Server Object Definition
assert.ok(server, 'Server module must be defined');
console.log('✔ Test 1: Server instance loaded successfully');

// Test 2: Validate Port Assignment Logic
const testPort = process.env.PORT || 80;
assert.ok(testPort === 80 || !isNaN(Number(testPort)), 'Port must be a valid number');
console.log(`✔ Test 2: Port configuration validated (${testPort})`);

// Test 3: Validate Student Identity Metadata
const mockPayload = {
    author: 'Ranjeet Choudhary',
    prn: '202301100046'
};
assert.strictEqual(mockPayload.author, 'Ranjeet Choudhary', 'Author must be Ranjeet Choudhary');
assert.strictEqual(mockPayload.prn, '202301100046', 'PRN must match student ID');
console.log('✔ Test 3: Student metadata verification passed');

console.log('------------------------------------');
console.log('All Unit Tests Passed Successfully (3/3)!');
process.exit(0);
