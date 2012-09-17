#pragma strict

@script RequireComponent(SynthController)

@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;

private var synth : SynthController;
private var scale = MusicalScale(41);
private var envelope = Envelope();

function Start() {
    synth = GetComponent.<SynthController>();
    envelope.sustain = true;
}

function Update() {
    envelope.attack = env_atk;
    envelope.release = env_rel;
    if (Input.GetMouseButtonDown(0)) {
        var note = scale.GetNote(32 * Input.mousePosition.y / Screen.height);
        envelope = synth.KeyOn(note, envelope);
    }
    if (Input.GetMouseButtonUp(0)) {
        envelope.KeyOff();
    }
}
