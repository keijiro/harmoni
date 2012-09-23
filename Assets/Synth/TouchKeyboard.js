#pragma strict

@script RequireComponent(SynthController)

@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;

@HideInInspector var lastNote = -1;

private var synth : SynthController;
private var noise : NoiseController;
private var scale = MusicalScale(41, 0);
private var envelope = Envelope();

function Start() {
    synth = GetComponent.<SynthController>();
    noise = FindObjectOfType(NoiseController);
    envelope.sustain = true;
}

function Update() {
    envelope.attack = env_atk;
    envelope.release = env_rel;
    
    if (Input.GetMouseButtonDown(0)) {
        lastNote = scale.GetNote(32 * Input.mousePosition.y / Screen.height);
        envelope = synth.KeyOn(lastNote, envelope);
    }
    
    if (Input.GetMouseButton(0)) noise.KeyOn(1.0);

    if (Input.GetMouseButtonUp(0)) {
        envelope.KeyOff();
    }
}
