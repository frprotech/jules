package com.frprotech.dvrlive

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.KeyEvent
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import kotlin.math.sqrt

class MainActivity : Activity() {

    private lateinit var prefs: Prefs
    private lateinit var gridHost: LinearLayout
    private lateinit var hint: TextView
    private val tiles = mutableListOf<StreamTile>()

    private var cols = 2
    private var pageSize = 4
    private var pages = 1
    private var page = 0
    private var sel = 0

    private val hideHint = Runnable { hint.animate().alpha(0f).setDuration(400).start() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        prefs = Prefs(this)

        gridHost = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        hint = TextView(this).apply {
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            setBackgroundResource(R.drawable.label_bg)
            setPadding(24, 10, 24, 10)
        }
        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.BLACK)
            addView(gridHost, FrameLayout.LayoutParams(-1, -1))
            addView(hint, FrameLayout.LayoutParams(-2, -2, Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL).apply {
                bottomMargin = 32
            })
        }
        setContentView(root)
    }

    override fun onStart() {
        super.onStart()
        if (!prefs.isConfigured) {
            startActivity(Intent(this, SettingsActivity::class.java))
            return
        }
        buildGrid()
        showPage()
    }

    override fun onStop() {
        tiles.forEach { it.release() }
        super.onStop()
    }

    private fun buildGrid() {
        tiles.forEach { it.release() }
        tiles.clear()
        gridHost.removeAllViews()

        pageSize = prefs.gridSize
        cols = sqrt(pageSize.toDouble()).toInt().coerceAtLeast(1)
        pages = ((prefs.channels + pageSize - 1) / pageSize).coerceAtLeast(1)
        page = page.coerceIn(0, pages - 1)
        sel = sel.coerceIn(0, pageSize - 1)

        val gap = 2
        repeat(cols) { r ->
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
            repeat(cols) { c ->
                val index = r * cols + c
                val tile = StreamTile(this, muted = true).apply {
                    isFocusable = false
                    setOnClickListener { sel = index; openFullscreen() }
                }
                tiles += tile
                row.addView(tile, LinearLayout.LayoutParams(0, -1, 1f).apply { setMargins(gap, gap, gap, gap) })
            }
            gridHost.addView(row, LinearLayout.LayoutParams(-1, 0, 1f))
        }
    }

    private fun showPage() {
        tiles.forEachIndexed { i, tile ->
            val ch = page * pageSize + i + 1
            if (ch <= prefs.channels) tile.bind("CH $ch", prefs.url(ch, main = pageSize == 1 && prefs.hdFullscreen))
            else tile.bind(null, null)
            tile.start()
        }
        select(sel)
        val pageText = if (pages > 1) "Page ${page + 1}/$pages  ·  ◀ ▶ more cameras  ·  " else ""
        showHint("${pageText}OK: full screen  ·  Hold OK: settings")
    }

    private fun select(i: Int) {
        sel = i
        tiles.forEachIndexed { idx, t -> t.setHighlighted(idx == sel && pageSize > 1) }
    }

    private fun changePage(delta: Int, newSel: Int) {
        if (pages <= 1) return
        page = (page + delta + pages) % pages
        sel = newSel
        showPage()
    }

    private fun openFullscreen(channel: Int = page * pageSize + sel + 1) {
        if (channel !in 1..prefs.channels) return
        startActivity(Intent(this, FullscreenActivity::class.java).putExtra(FullscreenActivity.EXTRA_CHANNEL, channel))
    }

    private fun openSettings() = startActivity(Intent(this, SettingsActivity::class.java))

    private fun showHint(text: String) {
        hint.text = text
        hint.animate().cancel()
        hint.alpha = 1f
        hint.removeCallbacks(hideHint)
        hint.postDelayed(hideHint, 5000)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val col = sel % cols
        val row = sel / cols
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> if (col > 0) select(sel - 1) else changePage(-1, row * cols + cols - 1)
            KeyEvent.KEYCODE_DPAD_RIGHT -> if (col < cols - 1) select(sel + 1) else changePage(1, row * cols)
            KeyEvent.KEYCODE_DPAD_UP -> if (row > 0) select(sel - cols)
            KeyEvent.KEYCODE_DPAD_DOWN -> if (row < cols - 1) select(sel + cols)
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_NUMPAD_ENTER -> {
                if (event.repeatCount == 0) event.startTracking()
            }
            KeyEvent.KEYCODE_MENU, KeyEvent.KEYCODE_SETTINGS -> openSettings()
            KeyEvent.KEYCODE_CHANNEL_UP, KeyEvent.KEYCODE_PAGE_DOWN, KeyEvent.KEYCODE_MEDIA_FAST_FORWARD -> changePage(1, sel)
            KeyEvent.KEYCODE_CHANNEL_DOWN, KeyEvent.KEYCODE_PAGE_UP, KeyEvent.KEYCODE_MEDIA_REWIND -> changePage(-1, sel)
            in KeyEvent.KEYCODE_1..KeyEvent.KEYCODE_9 -> openFullscreen(keyCode - KeyEvent.KEYCODE_0)
            else -> return super.onKeyDown(keyCode, event)
        }
        return true
    }

    override fun onKeyLongPress(keyCode: Int, event: KeyEvent): Boolean {
        if (isOk(keyCode)) { openSettings(); return true }
        return super.onKeyLongPress(keyCode, event)
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {
        if (isOk(keyCode)) {
            if (event.isTracking && !event.isCanceled) openFullscreen()
            return true
        }
        return super.onKeyUp(keyCode, event)
    }

    private fun isOk(k: Int) = k == KeyEvent.KEYCODE_DPAD_CENTER || k == KeyEvent.KEYCODE_ENTER || k == KeyEvent.KEYCODE_NUMPAD_ENTER
}
