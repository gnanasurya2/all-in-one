package expo.modules.readsms

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.net.Uri
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import expo.modules.core.interfaces.Arguments
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

const val  kRequestCode = 1
class ReadSmsModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  @SuppressLint("Range")
  override fun definition() = ModuleDefinition {
    Name("ReadSms")

    Function("requestSMSPermission") {
      val activity = appContext.activityProvider?.currentActivity
      val applicationContext = activity?.applicationContext

      if(applicationContext != null) {
        val permissionCheck = ContextCompat.checkSelfPermission(
          applicationContext,
          Manifest.permission.READ_SMS
        )

        if(permissionCheck != PackageManager.PERMISSION_GRANTED) {
          ActivityCompat.requestPermissions(
            activity,
            arrayOf(Manifest.permission.READ_SMS),
            kRequestCode
          )
        }
      }
    }
    data class SMSData(val smsId: Long, val address: String, val body: String)

    Function("readLastNSMS") {numberOfMessages: Int ->
      val activity = appContext.activityProvider?.currentActivity
      val applicationContext = activity?.applicationContext
      var messages = arrayListOf<Map<String,Any>>()
      if(applicationContext != null) {
        val uri = Uri.parse("content://sms")
        val cursor = applicationContext.contentResolver.query(uri,null,null,null,null)
        var numberOfMessagesLeft = numberOfMessages


        cursor?.use {
          if(it.moveToFirst()) {
            do {
              val smsId = it.getLong(it.getColumnIndex("_id"))
              val address = it.getString(it.getColumnIndex("address"))
              val body = it.getString(it.getColumnIndex("body"))
              val dateLong = cursor.getLong(cursor.getColumnIndex("date"))
              messages.add(mapOf("smsId" to smsId, "address" to address, "body" to body,"date" to dateLong))

            } while (it.moveToNext() && numberOfMessagesLeft-- != 0)
          }
        }
      }
      return@Function messages;
    }

    Function("readLastSMS") {
      val activity = appContext.activityProvider?.currentActivity
      val applicationContext = activity?.applicationContext

      if(applicationContext != null) {
        val uri = Uri.parse("content://sms")
        val cursor = applicationContext.contentResolver.query(uri,null,null,null,null)


        cursor?.use {
          if(it.moveToFirst()) {
            return@Function it.getString(it.getColumnIndex("body"))
          } else {
            return@Function "Message not read"
          }
        }
      } else {
        return@Function "application context is null"
      }

    }
    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! from native 👋"
    }

  }
}
