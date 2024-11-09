package com.nativereadsms

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider


class NativeReadSmsPackage: TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if(name == NativeReadSmsModule.NAME) {
            NativeReadSmsModule(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            NativeReadSmsModule.NAME to ReactModuleInfo(
                _name = NativeReadSmsModule.NAME,
                _className = NativeReadSmsModule.NAME,
                _canOverrideExistingModule = false,
                _needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}