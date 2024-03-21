class Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        this.packetType = packetType;
        this.flags = flags;
        this.remainLength = remainLength;
        this.buffer = slicedBuffer;
    }

    toString()
    {
        return `Packet Type: ${this.packetType}\nFlags: ${this.flags}\nRemaining Length: ${this.remainLength}\nBuffer: ${this.buffer}`;
    }
}
module.exports = Packet;
