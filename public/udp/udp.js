//const { OpusEncoder } = require('@discordjs/opus');
const dgram = require('dgram');
const OpusScript = require('opusscript');
const tweetnacl = require('tweetnacl');
//const Speaker = require('speaker');

const { ipcMain } = require('electron');
//import tweetnacl from 'tweetnacl'

const client = dgram.createSocket('udp4');

function udp(ip, port, ssrc, callback) {
    const PORT = port
    const HOST = ip
    
    client.on('message', (message, remote) => {
        //console.log("got message from server ==> ", remote.address + ':' + remote.port +' - ' + message);
        //console.log(Buffer.from(message))
        onUdpMessage(Buffer.from(message))
        //const decrypted = decrypt(message)
        //console.log(decrypted)
    });
    
    function sendMessage(message) {
        if (message) {
        client.send(message, 0, message.length, PORT, HOST, (err, bytes) => {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST + ':' + PORT);
            // client.close();
            });
       }
    }

    client.on('listening', () => {
        const address = client.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    function performIPDiscovery(ssrc) {
		return new Promise((resolve, reject) => {
			const listener = (message) => {
				try {
                    console.log('IP discovery results...');
					if (message.readUInt16BE(0) !== 2) return;
					const packet = parseLocalPacket(message);
					client.off('message', listener);
					resolve(packet);
				} catch {}
			};

			client.on('message', listener);
			client.once('close', () => reject(new Error('Cannot perform IP discovery - socket closed')));

			const discoveryBuffer = Buffer.alloc(74);

			discoveryBuffer.writeUInt16BE(1, 0);
			discoveryBuffer.writeUInt16BE(70, 2);
			discoveryBuffer.writeUInt32BE(ssrc, 4);
			client.send(discoveryBuffer, PORT, HOST, (err, bytes) => {
                if (err) throw err;
                console.log('IP discovery sent to ' + HOST + ':' + PORT);
            });
		});
	}

    performIPDiscovery(ssrc).then(({ ip, port }) => {
        callback(ip, port)
    })
}

function parseLocalPacket(message) {
    const packet = Buffer.from(message);

    const ip = packet.slice(8, packet.indexOf(0, 8)).toString('utf-8');

    const port = packet.readUInt16BE(packet.length - 2);

    console.log(`IP discovery results: IP: ${ip}, Port: ${port}`)

    return { ip, port };
}

let key

/*function decrypt(message) {
    if (!key) {
        console.warn('NO UDP KEY')
        return
    }

    const encrypted = Buffer.from(message, 'base64')

    let decipher = crypto.createDecipheriv('aes-256-gcm', key, null) //

    decipher.setAuthTag(encrypted.slice(-16))
    decipher.setAAD(Buffer.from(associated_data))

    let output = Buffer.concat([
        decipher.update(encrypted.slice(0, -16)),
        decipher.final()
    ])

    return output
    //console.log(output.toString())
}*/
const methods = {
    open: tweetnacl.secretbox.open,
	close: tweetnacl.secretbox,
	random: (n) => tweetnacl.randomBytes(n),
}

/**
 * 
 * @param {Buffer} buffer 
 * @param {string} mode 
 * @param {Buffer} nonce 
 * @param {Uint8Array} secretKey 
 * @returns {Buffer | undefined}
 */
function decrypt(buffer, mode, nonce, secretKey) {
	// Choose correct nonce depending on encryption
	let end;
	if (mode === 'xsalsa20_poly1305_lite') {
		buffer.copy(nonce, 0, buffer.length - 4);
		end = buffer.length - 4;
	} else if (mode === 'xsalsa20_poly1305_suffix') {
		buffer.copy(nonce, 0, buffer.length - 24);
		end = buffer.length - 24;
	} else {
		buffer.copy(nonce, 0, 0, 12);
	}
	// Open packet
	const decrypted = methods.open(buffer.slice(12, end), nonce, secretKey);
	if (!decrypted) return;
	return Buffer.from(decrypted);
}
/**
 * Parses an audio packet, decrypting it to yield an Opus packet.
 *
 * @param {Buffer} buffer The buffer to parse
 * @param {string} mode The encryption mode
 * @param {Buffer} nonce The nonce buffer used by the connection for encryption
 * @param {Uint8Array} secretKey The secret key used by the connection for encryption
 * @returns The parsed Opus packet
 */
function parsePacket(buffer, mode, nonce, secretKey) {
	let packet = /*this.*/decrypt(buffer, mode, nonce, secretKey);
    //console.log(packet)
	if (!packet) return;
	// Strip RTP Header Extensions (one-byte only)
	if (packet[0] === 0xbe && packet[1] === 0xde && packet.length > 4) {
		const headerExtensionLength = packet.readUInt16BE(2);
		let offset = 4;
		for (let i = 0; i < headerExtensionLength; i++) {
			const byte = packet[offset];
			offset++;
			if (byte === 0) continue;
			offset += 1 + (byte >> 4);
		}
		// Skip over undocumented Discord byte (if present)
		const byte = packet.readUInt8(offset);
		if (byte === 0x00 || byte === 0x02) offset++;
		packet = packet.slice(offset);
	}
	return packet;
}

const opus = new OpusScript(48000, 2, OpusScript.Application.AUDIO);
/*const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000
});*/

/**
 * Called when the UDP socket of the attached connection receives a message.
 *
 * @param {Buffer} msg The received message
 * @internal
 */
function onUdpMessage(msg) {
    
    const secretKey = key
    if (!secretKey) {
        console.warn('NO UDP KEY')
        return
    }

	if (msg.length <= 8) return;
	//const ssrc = msg.readUInt32BE(8);

	/*const userData = this.ssrcMap.get(ssrc);
	if (!userData) return;
	this.speaking.onPacket(userData.userId);*/

	/*const stream = this.subscriptions.get(userData.userId); // AudioReceiveStream
	if (!stream) return;*/

    const encryptionMode = 'xsalsa20_poly1305_lite'
    const nonceBuffer = Buffer.alloc(24)

	//if (this.connectionData.encryptionMode && this.connectionData.nonceBuffer && this.connectionData.secretKey) {
		const packet = /*this.*/parsePacket(
			msg,
			/*this.connectionData.*/encryptionMode,
			/*this.connectionData.*/nonceBuffer,
			/*this.connectionData.*/secretKey,
		);
        if (packet) {
            //const audio = [...opus.decode(packet)];
            const audio = opus.decode(packet);
            console.log(audio);
            //speaker.write(audio);
            //ipcMain.emit('pcm', ...audio);
        }
		/*if (packet) {
			stream.push(packet);
		} else {
			stream.destroy(new Error('Failed to parse packet'));
		}*/
	//}
}


/**
 * 
 * @param {number[]} key_ 
 */
function receiveKey(key_) {
    console.log(key_)
    key = Uint8Array.from(key_)
    console.log(key)

}

function disconnectUDP() {
    console.log("TODO?")
    try {
        client.disconnect();
    } catch { }
}

module.exports.udp = udp
module.exports.disconnectUDP = disconnectUDP
module.exports.receiveKey = receiveKey