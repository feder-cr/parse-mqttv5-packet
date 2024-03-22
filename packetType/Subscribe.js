const Packet = require('./Packet');
const { decodeVariableByteInteger } = require('./util');

class Subscribe extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);
        let index = 0;

        // Packet Identifier
        this.packetId = this.buffer.readUInt16BE(index);
        index += 2;

        // Proprietà
        if (this.buffer.length > index)
        {
            const { value: propertiesLength, bytesRead } = decodeVariableByteInteger(this.buffer, index);
            index += bytesRead;

            if (propertiesLength > 0)
            {
                const propertiesEndIndex = index + propertiesLength;
                this.properties = Subscribe.extractProperties(this.buffer, index, propertiesEndIndex);
                index = propertiesEndIndex;
            }
            else
            {
                this.properties = {};
            }
        }

        // Topics e QoS
        this.topics = [];
        while (index < this.buffer.length)
        {
            const topicLength = this.buffer.readUInt16BE(index);
            index += 2;
            const topic = this.buffer.slice(index, index + topicLength).toString();
            index += topicLength;
            const QoS = this.buffer[index++];
            this.topics.push({ name: topic, QoS });
        }
    }

    static extractProperties(buffer, startIndex, endIndex)
    {
        const properties = {};
        let index = startIndex;

        while (index < endIndex)
        {
            const propertyIdentifier = buffer.readUInt8(index++);
            switch (propertyIdentifier)
            {
            case 0x0B: // Subscription Identifier
                const { value: subscriptionIdentifier, bytesRead } = decodeVariableByteInteger(buffer, index);
                properties.subscriptionIdentifier = subscriptionIdentifier;
                index += bytesRead;
                break;
            case 0x26: // User Property
                if (!properties.userProperties)
                {
                    properties.userProperties = [];
                }
                const propertyNameLength = buffer.readUInt16BE(index);
                index += 2;
                const propertyName = buffer.toString('utf8', index, index + propertyNameLength);
                index += propertyNameLength;

                const propertyValueLength = buffer.readUInt16BE(index);
                index += 2;
                const propertyValue = buffer.toString('utf8', index, index + propertyValueLength);
                index += propertyValueLength;

                properties.userProperties.push({ name: propertyName, value: propertyValue });
                break;
            default:
                console.warn(`Unknown property identifier: ${propertyIdentifier}`);
                index = endIndex;
                break;
            }
        }

        return properties;
    }
}

module.exports = Subscribe;
