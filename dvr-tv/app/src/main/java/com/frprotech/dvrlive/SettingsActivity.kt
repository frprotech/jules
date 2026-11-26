package com.frprotech.dvrlive

import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.RadioGroup
import android.widget.Toast

class SettingsActivity : Activity() {

    private lateinit var prefs: Prefs

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        prefs = Prefs(this)

        val host = findViewById<EditText>(R.id.host)
        val port = findViewById<EditText>(R.id.port)
        val user = findViewById<EditText>(R.id.user)
        val pass = findViewById<EditText>(R.id.pass)
        val channels = findViewById<EditText>(R.id.channels)
        val grid = findViewById<RadioGroup>(R.id.grid)
        val hd = findViewById<CheckBox>(R.id.hd)

        host.setText(prefs.host)
        port.setText(prefs.port.toString())
        user.setText(prefs.user)
        pass.setText(prefs.pass)
        channels.setText(prefs.channels.toString())
        hd.isChecked = prefs.hdFullscreen
        grid.check(
            when (prefs.gridSize) {
                1 -> R.id.grid1
                9 -> R.id.grid9
                16 -> R.id.grid16
                else -> R.id.grid4
            }
        )

        findViewById<Button>(R.id.save).setOnClickListener {
            val h = host.text.toString().trim()
            if (h.isEmpty()) {
                host.error = "Enter the DVR IP address"
                host.requestFocus()
                return@setOnClickListener
            }
            prefs.host = h
            prefs.port = port.text.toString().toIntOrNull() ?: 554
            prefs.user = user.text.toString().trim()
            prefs.pass = pass.text.toString()
            prefs.channels = (channels.text.toString().toIntOrNull() ?: 4).coerceIn(1, 64)
            prefs.hdFullscreen = hd.isChecked
            prefs.gridSize = when (grid.checkedRadioButtonId) {
                R.id.grid1 -> 1
                R.id.grid9 -> 9
                R.id.grid16 -> 16
                else -> 4
            }
            Toast.makeText(this, "Saved", Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (!prefs.isConfigured) finishAffinity() else super.onBackPressed()
    }
}
