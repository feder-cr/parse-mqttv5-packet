class Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        this.packetType = packetType;
        this.flags = flags;
        this.remainLength = remainLength;
        this.buffer = slicedBuffer;
    }
}
module.exports = Packet;
