package com.frprotech.dvrlive

import android.app.Activity
import android.os.Bundle
import android.view.KeyEvent
import android.view.WindowManager

class FullscreenActivity : Activity() {

    private lateinit var prefs: Prefs
    private lateinit var tile: StreamTile
    private var channel = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        prefs = Prefs(this)
        channel = intent.getIntExtra(EXTRA_CHANNEL, 1)
        tile = StreamTile(this, muted = false)
        setContentView(tile)
    }

    override fun onStart() {
        super.onStart()
        play()
    }

    override fun onStop() {
        tile.release()
        super.onStop()
    }

    private fun play() {
        tile.bind("CH $channel  ·  ◀ ▶ switch", prefs.url(channel, main = prefs.hdFullscreen))
        tile.start()
    }

    private fun step(d: Int) {
        val n = prefs.channels.coerceAtLeast(1)
        channel = ((channel - 1 + d + n) % n) + 1
        play()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_RIGHT, KeyEvent.KEYCODE_CHANNEL_UP, KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> step(1)
            KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_CHANNEL_DOWN, KeyEvent.KEYCODE_MEDIA_REWIND -> step(-1)
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> finish()
            in KeyEvent.KEYCODE_1..KeyEvent.KEYCODE_9 -> {
                val ch = keyCode - KeyEvent.KEYCODE_0
                if (ch <= prefs.channels) { channel = ch; play() }
            }
            else -> return super.onKeyDown(keyCode, event)
        }
        return true
    }

    companion object {
        const val EXTRA_CHANNEL = "channel"
    }
}
