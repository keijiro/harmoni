#pragma strict

@script RequireComponent(SynthController)

var interval = 4;

@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;

private var synth : SynthController;
private var envelope = Envelope();
private var scale = MusicalScale(41 + 12 * 3);
private var time = 0.0;
private var touch = 2.0;

function Start() {
    synth = GetComponent.<SynthController>();

    var prevNote = -1;

    while (true) {
        while (touch > 0.0) yield;

        envelope.amplifier = 0.0;

        while (touch <= 0.0) {
            envelope.amplifier = Mathf.Min(envelope.amplifier + 0.005, 0.7);

            var note = scale.GetNote(Perlin.Fbm(time, 4) * 24);
            if (note != prevNote) {
                synth.KeyOn(note, envelope);
                prevNote = note;
            }

            time += 0.1713;

            yield WaitForSeconds(1.0 / 60 * interval);
        }
    }
}

function Update() {
    envelope.attack = env_atk;
    envelope.release = env_rel;

    if (Input.GetMouseButton(0)) {
        touch = 5.0;
    } else {
        touch -= Time.deltaTime;
    }
}
