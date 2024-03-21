const {
    Packet, Connect, ConnAck, Publish, PubAck, PubRec, PubRel, PubComp, Subscribe, SubAck, UnSubscribe, UnSubAck,
} = require('./packetType');

/* eslint-disable no-bitwise */
class Parser
{
    /* constructor()
    {
        // in un prossimo aggiornamento si può usare per v3
    } */

    parse(buffer)
    {
        this.index = 0; // Reimposta l'indice ogni volta che si inizia il parsing di un nuovo buffer
        const packets = []; // Array per conservare i pacchetti estratti
        // Ciclo che continua fino a quando non viene analizzato l'intero buffer
        while (this.index < buffer.length)
        {
        // Estrazione della lunghezza rimanente e dell'indice del prossimo byte da leggere
            const { remainLength, nextIndex } = Parser.extractRemainLength(buffer.slice(this.index));
            // Estrazione del tipo di pacchetto e delle flag
            const packetType = Parser.extractPacketType(buffer[this.index]);
            const flags = Parser.extractFlags(buffer[this.index]);
            // Creazione di un buffer "tagliato" che contiene solo i dati del pacchetto corrente
            const slicedBuffer = buffer.slice(this.index + nextIndex, this.index + nextIndex + remainLength);
            // Costruzione del pacchetto e aggiunta all'array dei pacchetti
            const packet = Parser.correctType(packetType, flags, remainLength, slicedBuffer);
            packets.push(packet);
            // Aggiornamento dell'indice per passare al successivo pacchetto nel buffer
            this.index += nextIndex + remainLength;
        }
        return packets; // Ritorno dell'array contenente tutti i pacchetti estratti
    }

    static correctType(packetType, flags, remainLength, slicedBuffer)
    {
        switch (packetType)
        {
        case 1: // PacketType.CONNECT
            return new Connect(packetType, flags, remainLength, slicedBuffer);
        case 2: // PacketType.CONNACK
            return new ConnAck(packetType, flags, remainLength, slicedBuffer);
        case 3: // PacketType.PUBLISH
            return new Publish(packetType, flags, remainLength, slicedBuffer);
        case 4: // PacketType.PUBACK
            return new PubAck(packetType, flags, remainLength, slicedBuffer);
        case 5: // PacketType.PUBREC
            return new PubRec(packetType, flags, remainLength, slicedBuffer);
        case 6: // PacketType.PUBCOMP
            return new PubRel(packetType, flags, remainLength, slicedBuffer);
        case 7: // PacketType.PUBREL
            return new PubComp(packetType, flags, remainLength, slicedBuffer);
        case 8: // PacketType.SUBSCRIBE
            return new Subscribe(packetType, flags, remainLength, slicedBuffer);
        case 9: // PacketType.SUBACK
            return new SubAck(packetType, flags, remainLength, slicedBuffer);
        case 10: // PacketType.UNSUBSCRIBE
            return new UnSubscribe(packetType, flags, remainLength, slicedBuffer);
        case 11: // PacketType.UNSUBACK
            return new UnSubAck(packetType, flags, remainLength, slicedBuffer);
        case 12: // PacketType.PINGREQ
            return new Packet(packetType, flags, remainLength, slicedBuffer);
        case 13: // PacketType.PINGRESP
            return new Packet(packetType, flags, remainLength, slicedBuffer);
        case 14: // PacketType.DISCONNECT
            return new Packet(packetType, flags, remainLength, slicedBuffer);
        default:
            return new Packet(packetType, flags, remainLength, slicedBuffer);
        }
    }

    static extractPacketType(byte)
    {
        return byte >> 4;
    }

    static extractFlags(byte)
    {
        return byte & 0x0F;
    }

    static extractRemainLength(buffer)
    {
        let multiplier = 1;
        let value = 0;
        let index = 1;
        let encodedByte;
        do
        {
            encodedByte = buffer[index++];
            value += (encodedByte & 127) * multiplier;
            multiplier *= 128;
            if (multiplier > 128 * 128 * 128)
            {
                throw new Error('Malformed Remaining Length');
            }
        } while ((encodedByte & 128) !== 0);

        return { remainLength: value, nextIndex: index };
    }
}

module.exports = Parser;
