#pragma strict

class Envelope {
    var attack = 0.003;
    var release = 0.2;
    var current = 0.0;
    var sustain = false;

    private var delta = 0.0;

    function KeyOn() {
        delta = 1.0 / (attack * SynthConfig.kSampleRate);
    }

    function KeyOff() {
        delta = -1.0 / (release * SynthConfig.kSampleRate);
    }

    function Update() {
        if (delta > 0.0) {
            current += delta;
            if (current >= 1.0) {
                current = 1.0;
                if (!sustain) KeyOff();
            }
        } else {
            current = Mathf.Max(current + delta, 0.0);
        }
    }
}
