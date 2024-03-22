const Packet = require('./Packet');

class UnSubscribe extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);
        let index = 0;
        this.packetId = this.buffer.readUInt16BE(index);
        index += 2;
        this.topics = [];
        let topicLength;
        while (index < this.buffer.length)
        {
            topicLength = this.buffer.readUInt16BE(index);
            this.topics.push(this.buffer.slice(index + 2, index + 2 + topicLength)
                .toString());
            index += 2 + topicLength;
        }
    }
}

module.exports = UnSubscribe;
