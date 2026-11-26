package com.frprotech.dvrlive

import android.content.Context
import android.net.Uri

class Prefs(context: Context) {
    private val sp = context.getSharedPreferences("dvr", Context.MODE_PRIVATE)

    var host: String
        get() = sp.getString("host", "")!!
        set(v) = sp.edit().putString("host", v).apply()
    var port: Int
        get() = sp.getInt("port", 554)
        set(v) = sp.edit().putInt("port", v).apply()
    var user: String
        get() = sp.getString("user", "admin")!!
        set(v) = sp.edit().putString("user", v).apply()
    var pass: String
        get() = sp.getString("pass", "")!!
        set(v) = sp.edit().putString("pass", v).apply()
    var channels: Int
        get() = sp.getInt("channels", 4)
        set(v) = sp.edit().putInt("channels", v).apply()
    var gridSize: Int
        get() = sp.getInt("grid", 4)
        set(v) = sp.edit().putInt("grid", v).apply()
    var hdFullscreen: Boolean
        get() = sp.getBoolean("hd", true)
        set(v) = sp.edit().putBoolean("hd", v).apply()

    val isConfigured get() = host.isNotBlank()

    /** Dahua / DMSS RTSP URL. subtype 0 = main (HD), 1 = sub (light). */
    fun url(channel: Int, main: Boolean): String {
        val auth = "${Uri.encode(user)}:${Uri.encode(pass)}@"
        val sub = if (main) 0 else 1
        return "rtsp://$auth$host:$port/cam/realmonitor?channel=$channel&subtype=$sub"
    }
}
