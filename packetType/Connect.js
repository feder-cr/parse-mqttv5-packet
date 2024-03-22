/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
const Packet = require('./Packet');
const { decodeVariableByteInteger } = require('./util');

class Connect extends Packet
{
    constructor(packetType, flags, remainLength, slicedBuffer)
    {
        super(packetType, flags, remainLength, slicedBuffer);

        let index = 0;

        // Header
        const protocolNameLength = this.buffer.readUInt16BE(index);
        this.protocolName = this.buffer.slice(index + 2, index + 2 + protocolNameLength).toString();
        index += 2 + protocolNameLength;

        this.protocolLevel = this.buffer[index++];
        const b = this.buffer[index++];
        this.connectFlags = {
            username: b >> 7 & 0x01,
            password: b >> 6 & 0x01,
            willRetain: b >> 5 & 0x01,
            willQoS: (b >> 3 & 0x03),
            willFlag: b >> 2 & 0x01,
            cleanSession: b >> 1 & 0x01,
            reserved: b & 0x01,
        };

        if (this.connectFlags.reserved) throw new Error('Connect flags reserved should be 0');

        this.keepAlive = this.buffer.readUInt16BE(index);
        index += 2;

        // Proprietà (MQTT 5.0)
        if (this.protocolLevel === 5)
        {
            const propertiesLength = decodeVariableByteInteger(this.buffer, index);
            index += propertiesLength.bytesRead;
            const propertiesEndIndex = index + propertiesLength.value;
            this.properties = Connect.extractProperties(this.buffer, index, propertiesEndIndex);
            index = propertiesEndIndex;
        }
        // Client ID
        const clientIdLength = this.buffer.readUInt16BE(index);
        index += 2;
        this.clientId = this.buffer.slice(index, index + clientIdLength).toString();
        index += clientIdLength;

        // Proprietà Will, se Will Flag è impostato
        if (this.connectFlags.willFlag)
        {
            const willPropertiesLength = decodeVariableByteInteger(this.buffer, index);
            index += willPropertiesLength.bytesRead;
            const willPropertiesEndIndex = index + willPropertiesLength.value;
            this.willProperties = this.extractWillProperties(this.buffer, index, willPropertiesEndIndex);
            index = willPropertiesEndIndex;

            // Will Topic
            const willTopicLength = this.buffer.readUInt16BE(index);
            index += 2;
            this.willTopic = this.buffer.slice(index, index + willTopicLength).toString();
            index += willTopicLength;

            // Will Payload
            const willPayloadLength = this.buffer.readUInt16BE(index);
            index += 2;
            this.willPayload = this.buffer.slice(index, index + willPayloadLength);
            index += willPayloadLength;
        }

        // User Name, se Username Flag è impostato
        if (this.connectFlags.username)
        {
            const userNameLength = this.buffer.readUInt16BE(index);
            index += 2;
            this.username = this.buffer.slice(index, index + userNameLength).toString();
            index += userNameLength;
        }

        // Password, se Password Flag è impostato
        if (this.connectFlags.password)
        {
            const passwordLength = this.buffer.readUInt16BE(index);
            index += 2;
            this.password = this.buffer.slice(index, index + passwordLength).toString();
            index += passwordLength;
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
            // Gestisci altri identificatori di proprietà come necessario
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
                // Qui potresti decidere di saltare il resto delle proprietà o gestire l'errore in altro modo
                index = endIndex; // Questo salterà il resto delle proprietà, evitando ulteriori errori
                break;
            }
        }

        return properties;
    }
}

module.exports = Connect;
