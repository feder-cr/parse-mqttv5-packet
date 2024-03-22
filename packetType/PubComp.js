const Packet = require('./Packet');

class PubComp extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);
        this.packetId = this.buffer.readUInt16BE(0);
    }
}

module.exports = PubComp;
