#pragma strict

@script RequireComponent(SynthController)

private var touch = 2.0;

function Start() {
    var synth = GetComponent.<SynthController>();
    var noise = FindObjectOfType(NoiseController) as NoiseController;
    var keyboard = FindObjectOfType(TouchKeyboard) as TouchKeyboard;
    var envelope = Envelope();

    while (true) {
        while (touch > 0.0) yield;

        if (keyboard.lastNote < 45 && keyboard.lastNote > 0) {
            // Bass mode.
            var scale = MusicalScale(41, 1);
            var interval = 512;
            var restOnSameNote = false;
            var range = 16;
            envelope.attack = 4.0;
            envelope.release = 4.0;
        } else if (keyboard.lastNote > 100) {
            // Noisy seq. mode.
            scale = MusicalScale(41 + 12 * 4, 1);
            interval = 8;
            range = 16;
            restOnSameNote = false;
            envelope.attack = 0.004;
            envelope.release = 0.02;
        } else {
            // Melody mode.
            scale = MusicalScale(41 + 12 * 3, 0);
            interval = 16;
            range = 24;
            restOnSameNote = true;
            envelope.attack = 0.08;
            envelope.release = 0.14;
        }

        var time = Random.Range(-10.0, 10.0);
        var prevNote = -1;

        envelope.amplifier = 0.0;

        while (touch <= 0.0) {
            envelope.amplifier = Mathf.Min(envelope.amplifier + 0.001 * interval, 0.7);

            var note = scale.GetNote(Perlin.Fbm(time, 4) * range);
            if (note != prevNote || !restOnSameNote) {
                synth.KeyOn(note, envelope);
                prevNote = note;
            }

            noise.KeyOn(envelope.amplifier);
            time += Random.Range(0.1, 0.2);

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
