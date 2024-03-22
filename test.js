const Parser = require('./Parser');

const parser = new Parser();
const packets = parser.parse(Buffer.from('NI4BAAxkaXNwbGF5Q29sb3IU51wDABBhcHBsaWNhdGlvbi9qc29uCAAVZGlzcGxheUNvbG9yL3Jlc3BvbnNlCQAGMTIzNDU2JgAJcHJvcGVydHkxAAZ2YWx1ZTEmAAlwcm9wZXJ0eTIABnZhbHVlMnsicmVkIjoxNzcsImdyZWVuIjoyMTEsImJsdWUiOjY2fTR2AAxkaXNwbGF5Q29sb3IU6FwDABBhcHBsaWNhdGlvbi9qc29uCAAVZGlzcGxheUNvbG9yL3Jlc3BvbnNlCQAGMTIzNDU2JgAJcHJvcGVydHkxAAZ2YWx1ZTEmAAlwcm9wZXJ0eTIABnZhbHVlMlsxLDIsMyw0XQ==","evt.time":1711077809277876135', 'base64'));
packets.forEach((element) =>
{
    console.log(element);
});
