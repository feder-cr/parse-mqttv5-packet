const Packet = require('./Packet');
const { decodeVariableByteInteger } = require('./util');

class SubAck extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);
        let index = 0;

        // Packet Identifier
        this.packetId = this.buffer.readUInt16BE(index);
        index += 2;

        // Property Length
        const { value: propertiesLength, bytesRead } = decodeVariableByteInteger(this.buffer, index);
        index += bytesRead;

        // Properties
        if (propertiesLength > 0)
        {
            if (index + propertiesLength > this.buffer.length)
            {
                throw new Error('Il buffer non contiene dati sufficienti per le proprietà.');
            }
            this.properties = UnSubAck.extractProperties(this.buffer, index, index + propertiesLength);
            index += propertiesLength;
        }
        else
        {
            this.properties = {};
        }

        // UNSUBACK Payload (Reason Codes)
        this.reasonCodes = [];
        while (index < this.buffer.length)
        {
            this.reasonCodes.push(this.buffer.readUInt8(index++));
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
            case 0x1F: // Stringa di motivo
                index = SubAck.addReasonString(properties, buffer, index);
                break;
            case 0x26: // Proprietà utente
                index = SubAck.addUserProperty(properties, buffer, index);
                break;
            default:
                console.warn(`Identificatore di proprietà sconosciuto: ${propertyIdentifier}`);
                index = endIndex;
                break;
            }
        }

        return properties;
    }

    static addReasonString(properties, buffer, index)
    {
        const length = buffer.readUInt16BE(index);
        index += 2;
        properties.reasonString = buffer.toString('utf8', index, index + length);
        index += length;
        return index;
    }

    static addUserProperty(properties, buffer, index)
    {
        if (!properties.userProperties)
        {
            properties.userProperties = [];
        }
        const nameLength = buffer.readUInt16BE(index);
        index += 2;
        const name = buffer.toString('utf8', index, index + nameLength);
        index += nameLength;

        const valueLength = buffer.readUInt16BE(index);
        index += 2;
        const value = buffer.toString('utf8', index, index + valueLength);
        index += valueLength;

        properties.userProperties.push({ name, value });
        return index;
    }
}

module.exports = SubAck;
