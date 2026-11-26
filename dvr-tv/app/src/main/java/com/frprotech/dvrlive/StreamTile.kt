package com.frprotech.dvrlive

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.TextView
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.rtsp.RtspMediaSource
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView

@SuppressLint("ViewConstructor")
@OptIn(UnstableApi::class)
class StreamTile(context: Context, private val muted: Boolean) : FrameLayout(context) {

    private val playerView = PlayerView(context).apply {
        useController = false
        resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
        setShutterBackgroundColor(Color.BLACK)
        setKeepContentOnPlayerReset(false)
    }
    private val label = TextView(context).apply {
        setTextColor(Color.WHITE)
        setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
        setBackgroundResource(R.drawable.label_bg)
        setPadding(dp(8), dp(3), dp(8), dp(3))
    }
    private val status = TextView(context).apply {
        setTextColor(Color.LTGRAY)
        setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
        gravity = Gravity.CENTER
    }
    private val border = View(context).apply {
        setBackgroundResource(R.drawable.tile_selected)
        visibility = GONE
    }

    private var player: ExoPlayer? = null
    private var url: String? = null
    private val retry = Runnable { start() }

    private val listener = object : Player.Listener {
        override fun onPlaybackStateChanged(state: Int) {
            if (state == Player.STATE_READY) status.visibility = GONE
        }

        override fun onPlayerError(error: PlaybackException) {
            showStatus("No signal, retrying…")
            removeCallbacks(retry)
            postDelayed(retry, RETRY_MS)
        }
    }

    init {
        setBackgroundColor(Color.BLACK)
        addView(playerView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
        addView(status, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
        addView(label, LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.TOP or Gravity.START
            setMargins(dp(8), dp(8), 0, 0)
        })
        addView(border, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    }

    fun bind(title: String?, streamUrl: String?) {
        release()
        url = streamUrl
        label.text = title ?: ""
        label.visibility = if (title == null) GONE else VISIBLE
        if (streamUrl == null) status.visibility = GONE
    }

    fun start() {
        release()
        val u = url ?: return
        showStatus("Connecting…")
        val loadControl = DefaultLoadControl.Builder()
            .setBufferDurationsMs(500, 3000, 250, 500)
            .build()
        val source = RtspMediaSource.Factory()
            .setForceUseRtpTcp(true)
            .setTimeoutMs(8000)
            .createMediaSource(MediaItem.fromUri(u))
        player = ExoPlayer.Builder(context).setLoadControl(loadControl).build().also {
            it.volume = if (muted) 0f else 1f
            it.addListener(listener)
            it.setMediaSource(source)
            it.playWhenReady = true
            it.prepare()
            playerView.player = it
        }
    }

    fun release() {
        removeCallbacks(retry)
        playerView.player = null
        player?.run {
            removeListener(listener)
            release()
        }
        player = null
    }

    fun setHighlighted(on: Boolean) {
        border.visibility = if (on) VISIBLE else GONE
    }

    private fun showStatus(text: String) {
        status.text = text
        status.visibility = VISIBLE
    }

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()

    companion object {
        private const val RETRY_MS = 5000L
    }
}
