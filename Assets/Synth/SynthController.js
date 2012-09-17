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

class ASynth {
    static private var seed = 0.0;

    var osc = Oscillator();
    var env = Envelope();
    var amp = Amplifier(env);
    var bit = Bitcrusher();
    var arp : Arpeggiator;

    function ASynth(bpm: int, base: int, octave : int) {
        arp = Arpeggiator(bpm, base + 12 * octave, seed);
        seed += 3.1415926;
    }

    function SetParam(
        bpm : int,
        fm_mul : int,
        fm_mod : float,
        env_atk : float,
        env_rel : float,
        bit_int : int,
        bit_mix : float)
    {
        arp.SetBpm(bpm);
        osc.multiplier = fm_mul;
        osc.modulation = fm_mod;
        env.attack = env_atk;
        env.release = env_rel;
        bit.interval = bit_int;
        bit.mix = bit_mix;
    }

    function Run() {
        if (arp.Run()) {
            osc.SetNote(arp.currentNote);
            env.Bang();
        }
        var x = bit.Run(amp.Run(osc.Run()));
        env.Update();
        return x;
    }
}

private var arp1 = ASynth(bpm, 46, 1);
private var arp2 = ASynth(bpm, 46, 3);

function Start() {
    audio.clip = AudioClip.Create("(null)", 0xfffffff, 1, SynthConfig.kSampleRate, false, true, function(data:float[]){});
    audio.Play();
}

function Update() {
    arp1.SetParam(bpm, fm_mul, fm_mod, env_atk, env_rel, bit_int, bit_mix);
    arp2.SetParam(bpm, fm_mul, fm_mod, env_atk, env_rel, bit_int, bit_mix);
}

function OnAudioFilterRead(data : float[], channels : int) {
    var lv = volume * 0.5 * (stereo + 1);
    var rv = volume - lv;
    for (var i = 0; i < data.Length; i += 2) {
        var s1 = arp1.Run();
        var s2 = arp2.Run();
        data[i    ] = s1 * lv + s2 * rv;
        data[i + 1] = s1 * rv + s2 * lv;
    }
}
