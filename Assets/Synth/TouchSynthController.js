#pragma strict

@script RequireComponent(AudioSource)

@Range(2.0, 200.0)  var bpm = 80.0;
@Range(0.0, 1.0)    var volume = 0.7;
@Range(-1.0, 1.0)   var stereo = 0.3;
@Range(1, 24)       var fm_mul = 1;
@Range(0.0, 1.0)    var fm_mod = 0.0;
@Range(0.003, 1.0)  var env_atk = 0.003;
@Range(0.003, 1.0)  var env_rel = 0.2;
@Range(1, 16)       var bit_int = 4;
@Range(0.0, 1.0)    var bit_mix = 1.0;

private var osc = Oscillator();
private var env = Envelope();
private var amp = Amplifier(env);
private var bit = Bitcrusher();
private var scale = MusicalScale(41);

private var keyFlag = false;
private var prevKeyFlag = false;

function Start() {
    osc.multiplier = fm_mul;
    osc.modulation = fm_mod;
    env.attack = env_atk;
    env.release = env_rel;
    env.sustain = true;
    bit.interval = bit_int;
    bit.mix = bit_mix;

    audio.clip = AudioClip.Create("(null)", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, function(data:float[]){});
    audio.Play();
}

function Update() {
    keyFlag = Input.GetMouseButton(0);
    if (keyFlag) {
        osc.SetNote(scale.GetNote(32 * Input.mousePosition.y / Screen.height));
    }
}

function OnAudioFilterRead(data : float[], channels : int) {
    for (var i = 0; i < data.Length; i += 2) {
        if (!prevKeyFlag && keyFlag) env.KeyOn();
        if (prevKeyFlag && !keyFlag) env.KeyOff();
        var x = bit.Run(amp.Run(osc.Run())) * volume;
        env.Update();
        data[i    ] = x;
        data[i + 1] = x;
        prevKeyFlag = keyFlag;
    }
}
