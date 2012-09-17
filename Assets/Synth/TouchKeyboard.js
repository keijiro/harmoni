#pragma strict

@script RequireComponent(SynthController)

@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;

private var synth : SynthController;
private var scale = MusicalScale(41);
private var envelopes = [Envelope(), Envelope()];
private var switcher = 0;

function Start() {
    synth = GetComponent.<SynthController>();
    for (var env in envelopes) env.sustain = true;
}

function Update() {
    for (var env in envelopes) {
        env.attack = env_atk;
        env.release = env_rel;
    }
    if (Input.GetMouseButtonDown(0)) {
        switcher = (switcher + 1) & 1;
        var note = scale.GetNote(32 * Input.mousePosition.y / Screen.height);
        synth.KeyOn(note, envelopes[switcher]);
    }
    if (Input.GetMouseButtonUp(0)) {
        envelopes[switcher].KeyOff();
    }
}
