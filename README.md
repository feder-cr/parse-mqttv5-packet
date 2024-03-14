# parse-mqttv5-packet

`parse-mqttv5-packet` is a JavaScript library designed for parsing MQTTv5 packets, offering a simple and efficient solution for working with the MQTT protocol in JavaScript applications.

## What is MQTT?

MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol, ideal for communication between devices on low-bandwidth networks and with limited resources. It's commonly used in IoT (Internet of Things) applications to facilitate device-to-device communication.

## Features

- Support for parsing various MQTTv5 packet types.
- Lightweight and easy to integrate.
- Detailed extraction of information from each packet type.

## Installation

Install `parse-mqttv5-packet` via npm:

```bash
npm install parse-mqttv5-packet
```
## Usage
Here's a basic example of how to use parse-mqttv5-packet to parse a Connect packet:
```
const { parse } = require('parse-mqttv5-packet');

const packet = Buffer.from([/* packet data here */]);
const parsedData = parse(packet);

console.log(parsedData);
```
## How parser work
The parse-mqttv5-packet library provides specific parsers for different MQTTv5 packet types:

### parseConnAck: Parses Connection Acknowledgment packets.
#### Packet Structure:

Byte 1: Packet type and flags (fixed byte for ConnAck).

Byte 2: Remaining length.

Byte 3: Acknowledge flags.

Byte 4: Connection return code.

#### Parser Functionality:

The parseConnAck parser extracts the connection return code and acknowledge flags to determine the connection status and communicate it to the client.

### parseConnect: Parses Connection packets.
#### Packet Structure:

Bytes 1-2: Packet type and remaining length.

Bytes 3-x: Protocol Name.

Byte x+1: Protocol Version.

Byte x+2: Connect flags.

Bytes x+3-x+4: Keep Alive timer.

Bytes x+5-end: Payload (Client Identifier, Will Topic, Will Message, Username, Password).

#### Parser Functionality:
The parseConnect parser extracts and interprets various components such as the client identifier, Will message topic, Will message, username, and password.

### parsePublish: Parses Publish packets.
#### Packet Structure:

Byte 1: Packet type and DUP, QoS, and RETAIN flags.

Bytes 2-x: Remaining length.

Bytes x+1-x+n: Topic name.

Bytes x+n+1-x+n+2 (if QoS > 0): Packet Identifier.

Bytes x+n+3-end: Message payload.

#### Parser Functionality:
The parsePublish parser extracts the topic, packet identifier (if QoS > 0), and message payload, handling the DUP, QoS, and RETAIN flags to determine how the message should be treated.

### parsePubAck: Parses Publish Acknowledgment packets.
#### Packet Structure:

Byte 1: Packet type.
Byte 2: Remaining length.
Bytes 3-4: Packet Identifier.
#### Parser Functionality:
The parsePubAck parser extracts the packet identifier, which is crucial for correlating the acknowledgment with its original publish message.

### parsePubRec: Parses Publish Received packets.
Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

#### Parser Functionality:
The parsePubRec parser is used in QoS 2 message flow, extracting the packet identifier to acknowledge that a publish message was received.

### parsePubRel: Parses Publish Release packets.
#### Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

#### Parser Functionality:
The parsePubRel parser is part of the QoS 2 protocol flow, indicating that the receiver can release the relevant message, identified by the packet identifier.

### parsePubComp: Parses Publish Complete packets.
#### Parser Functionality:
Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

#### Parser Functionality:
The parsePubComp parser concludes the QoS 2 message flow by acknowledging that the message was published completely, identified by the packet identifier.

### parseSubAck: Parses Subscribe Acknowledgment packets.
#### Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

Byte 5-end: Payload with return codes for each topic.

#### Parser Functionality:
The parseSubAck parser extracts the packet identifier and the return codes for each topic subscription, indicating the subscription's success or failure.

### parseSubscribe: Parses Subscribe packets.
#### Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

Byte 5-end: Payload with topic filters and QoS levels.

#### Parser Functionality
The parseSubscribe parser extracts the packet identifier and a list of topic filters with their corresponding QoS levels, indicating the topics the client wants to subscribe to.

### parseUnSubAck: Parses Unsubscribe Acknowledgment packets.
#### Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

#### Parser Functionality:
The parseUnSubAck parser extracts the packet identifier, acknowledging the receipt of an unsubscribe request.

### parseUnSubscribe: Parses Unsubscribe packets.
Packet Structure:

Byte 1: Packet type.

Byte 2: Remaining length.

Bytes 3-4: Packet Identifier.

Byte 5-end: Payload with topic filters.

#### Parser Functionality:
The parseUnSubscribe parser extracts the packet identifier and a list of topic filters, indicating the topics the client wants to unsubscribe from.

## Contributions
Contributions are welcome! Feel free to submit a pull request or create an issue if you have suggestions or find any bugs.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
