package com.nativereadsms

import android.Manifest
import android.content.pm.PackageManager
import android.net.Uri
import android.provider.Telephony.Sms
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray


class NativeReadSmsModule(reactContext: ReactApplicationContext): NativeReadSmsSpec(reactContext) {
    override fun getName() = NAME

    override fun requestSmsPermission() {
        val activity = reactApplicationContext.currentActivity
        val applicationContext = activity?.applicationContext

        if(applicationContext != null) {
            val permissionCheck = ContextCompat.checkSelfPermission(
                applicationContext,
                Manifest.permission.READ_SMS
            )

            if(permissionCheck != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.READ_SMS),1)
            }
        }
    }

    override fun hasSmsPermission(): Boolean {
        val activity = reactApplicationContext.currentActivity
        val applicationContext = activity?.applicationContext

        if(applicationContext != null) {
            return  ContextCompat.checkSelfPermission(applicationContext,Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED
        }

        return false
    }

    override fun readSms(timeStamp: Double, addressList: ReadableArray): WritableArray {
        val activity = reactApplicationContext.currentActivity
        val applicationContext = activity?.applicationContext

        val messages = Arguments.createArray()

        if(applicationContext != null && hasSmsPermission()) {
            val uri = Uri.parse("content://sms")

            val columns = arrayOf(Sms._ID,Sms.ADDRESS,Sms.BODY,Sms.DATE)

            val selection = addressList.toArrayList().joinToString(separator = " OR ") { term -> "$ADDRESS_COLUMN LIKE '%-$term%'"  }

            val cursor = applicationContext.contentResolver.query(uri,
                columns,
                "($selection) AND $DATE_COLUMN >= ?",
                arrayOf(timeStamp.toLong().toString()),
                "$DATE_COLUMN ASC"
            )

            cursor?.use {
                val idIndex = cursor.getColumnIndex(Sms._ID).coerceAtLeast(0)
                val dateIndex = cursor.getColumnIndex(Sms.DATE).coerceAtLeast(0)
                val bodyIndex = cursor.getColumnIndex(Sms.BODY).coerceAtLeast(0)
                val addressIndex = cursor.getColumnIndex(Sms.ADDRESS).coerceAtLeast(0)

                it.use { cursor ->
                    if(cursor.moveToFirst()) {
                        do {
                            val map = Arguments.createMap()
                            map.putString("smsId",it.getLong(idIndex).toString())
                            map.putString("address",it.getString(addressIndex))
                            map.putString("body", it.getString(bodyIndex))
                            map.putString("date", it.getLong(dateIndex).toString())
                            messages.pushMap(map)
                        } while (cursor.moveToNext())
                    }
                }
            }
        }

        return messages
    }

    companion object {
        const val NAME = "NativeReadSms"
        private const val ADDRESS_COLUMN = Sms.ADDRESS
        private const val DATE_COLUMN = Sms.DATE
    }
}