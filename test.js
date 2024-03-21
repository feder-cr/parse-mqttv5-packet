const Parser = require('./Parser');

const parser = new Parser();
const packets = parser.parse(Buffer.from('YgIjKQ==', 'base64'));
packets.forEach((element) =>
{
    console.log(element);
});
