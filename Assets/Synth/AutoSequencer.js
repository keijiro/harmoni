#pragma strict

@script RequireComponent(SynthController)

@Range(2.0, 200.0)  var bpm = 80.0;
@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;

private var synth : SynthController;
private var arpeggiators = [
    Arpeggiator(bpm, 41 + 12 * 4, 3.0),
    Arpeggiator(bpm, 41, 0.0)
];
private var envelopes = [Envelope(), Envelope()];
private var switcher = 0;

function Start() {
    synth = GetComponent.<SynthController>();
}

function Update() {
    for (var i = 0; i < 2; i++) {
        arpeggiators[i].SetBpm(bpm);

        envelopes[switcher].attack = env_atk;
        envelopes[switcher].release = env_rel;

        if (arpeggiators[i].Run()) {
            synth.KeyOn(arpeggiators[i].currentNote, envelopes[switcher]);
            switcher = (switcher + 1) & 1;
        }
    }
}
