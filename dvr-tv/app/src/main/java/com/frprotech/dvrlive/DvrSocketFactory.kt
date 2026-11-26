package com.frprotech.dvrlive

import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket
import javax.net.SocketFactory

/** Fails fast instead of hanging for minutes when the DVR is unreachable. */
class DvrSocketFactory(private val timeoutMs: Int = 5000) : SocketFactory() {
    override fun createSocket(): Socket = Socket()

    override fun createSocket(host: String, port: Int): Socket =
        Socket().apply { connect(InetSocketAddress(host, port), timeoutMs) }

    override fun createSocket(host: String, port: Int, localHost: InetAddress, localPort: Int): Socket =
        Socket().apply {
            bind(InetSocketAddress(localHost, localPort))
            connect(InetSocketAddress(host, port), timeoutMs)
        }

    override fun createSocket(host: InetAddress, port: Int): Socket =
        Socket().apply { connect(InetSocketAddress(host, port), timeoutMs) }

    override fun createSocket(address: InetAddress, port: Int, localAddress: InetAddress, localPort: Int): Socket =
        Socket().apply {
            bind(InetSocketAddress(localAddress, localPort))
            connect(InetSocketAddress(address, port), timeoutMs)
        }
}
