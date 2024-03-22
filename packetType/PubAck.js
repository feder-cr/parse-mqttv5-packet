const Packet = require('./Packet');
const { decodeVariableByteInteger } = require('./util');

class PubAck extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);
        let index = 0;

        // Packet Identifier
        this.packetId = this.buffer.readUInt16BE(index);
        index += 2;

        // PUBACK Reason Code (presente solo se la lunghezza del pacchetto è > 2)
        if (this.buffer.length > 2)
        {
            this.reasonCode = this.buffer[index++];
        }
        else
        {
            this.reasonCode = 0x00; // 0x00 indica successo in assenza di reason code esplicito
        }

        // PUBACK Properties
        if (this.buffer.length > 3)
        {
            const { value: propertiesLength, bytesRead } = decodeVariableByteInteger(this.buffer, index);
            index += bytesRead;

            if (propertiesLength > 0)
            {
                const propertiesEndIndex = index + propertiesLength;
                this.properties = this.extractProperties(this.buffer, index, propertiesEndIndex);
                index = propertiesEndIndex;
            }
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
            case 0x1F: // Reason String
                const reasonStringLength = buffer.readUInt16BE(index);
                index += 2;
                properties.reasonString = buffer.toString('utf8', index, index + reasonStringLength);
                index += reasonStringLength;
                break;
            case 0x26: // User Property
                if (!properties.userProperties)
                {
                    properties.userProperties = [];
                }
                const userPropertyNameLength = buffer.readUInt16BE(index);
                index += 2;
                const userPropertyName = buffer.toString('utf8', index, index + userPropertyNameLength);
                index += userPropertyNameLength;

                const userPropertyValueLength = buffer.readUInt16BE(index);
                index += 2;
                const userPropertyValue = buffer.toString('utf8', index, index + userPropertyValueLength);
                index += userPropertyValueLength;

                properties.userProperties.push({ name: userPropertyName, value: userPropertyValue });
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

module.exports = PubAck;
