#pragma strict

function Start() {
#if UNITY_IPHONE
    if (SystemInfo.processorCount == 1) {
        QualitySettings.SetQualityLevel(0);
    } else if (SystemInfo.deviceModel.StartsWith("iPad2") ||
               SystemInfo.deviceModel.StartsWith("iPad3")) {
        QualitySettings.SetQualityLevel(1);
    } else {
        QualitySettings.SetQualityLevel(2);
    }

    if (QualitySettings.GetQualityLevel() == 0) {
        AudioSettings.SetDSPBufferSize(512, 4);
        AudioSettings.outputSampleRate = SynthConfig.kSampleRate = 22050;
        Application.targetFrameRate = 30;
        Shader.globalMaximumLOD = 200;
    } else {
        AudioSettings.SetDSPBufferSize(256, 4);
	    AudioSettings.outputSampleRate = SynthConfig.kSampleRate = 44100;
        Application.targetFrameRate = 60;
        Shader.globalMaximumLOD = 400;
    }
#endif

#if UNITY_ANDROID
    QualitySettings.SetQualityLevel(1);
    SynthConfig.kSampleRate = AudioSettings.outputSampleRate;
    Shader.globalMaximumLOD = 400;
#endif

    yield;
    Application.LoadLevel(1);
}
