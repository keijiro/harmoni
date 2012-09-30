#pragma strict

@script RequireComponent(SynthController)

@HideInInspector var mode = 1;
private var touch = 2.0;

function Start() {
    var synth = GetComponent.<SynthController>();
    var noise = FindObjectOfType(NoiseController) as NoiseController;
    var envelope = Envelope();

    while (true) {
        while (touch > 0.0) yield;

        if (mode == 0) {
            // Bass mode.
            var scale = MusicalScale(41, 1);
            var interval = 512;
            var skipSameNote = false;
            var range = 16;
            envelope.attack = 4.0;
            envelope.release = 4.0;
        } else if (mode == 1) {
            // Melody mode.
            scale = MusicalScale(41 + 12 * 3, 0);
            interval = 16;
            range = 24;
            skipSameNote = true;
            envelope.attack = 0.08;
            envelope.release = 0.14;
        } else {
            // Noisy seq. mode.
            scale = MusicalScale(41 + 12 * 4, 1);
            interval = 8;
            range = 16;
            skipSameNote = false;
            envelope.attack = 0.004;
            envelope.release = 0.02;
        }

        var param = Random.Range(-10.0, 10.0);
        var prevNote = -1;

        envelope.amplifier = 0.0;

        while (touch <= 0.0) {
            envelope.amplifier = Mathf.Min(envelope.amplifier + 0.001 * interval, 0.7);

            var note = scale.GetNote(Perlin.Fbm(param, 4) * range);
            if (note != prevNote || !skipSameNote) synth.KeyOn(note, envelope);
            noise.KeyOn(envelope.amplifier);

            param += Random.Range(0.1, 0.2);
            prevNote = note;

            yield WaitForSeconds(1.0 / 60 * interval);
        }
    }
}

function Update() {
    if (Input.GetMouseButton(0)) {
        touch = 5.0;
    } else {
        touch -= Time.deltaTime;
    }
}
