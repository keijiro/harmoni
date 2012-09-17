#pragma strict

function Start() {
	Application.targetFrameRate = 60;

    yield;

    AudioSettings.outputSampleRate = SynthConfig.kSampleRate;

    yield;

    Application.LoadLevel(1);
}
