#pragma strict

class Arpeggiator {
    private var delta = 0.0;
    private var counter = 1.0;
    
    private var scale : MusicalScale;
    private var position = 0.0;
    
    var currentNote = -1;
    private var prevNote = -1;

    function Arpeggiator(bpm : int, base : int, seed : float) {
        SetBpm(bpm);
        scale = MusicalScale(base);
        position = seed;
    }

    function SetBpm(bpm : int) {
        delta = 4.0 * bpm / (SynthConfig.kSampleRate * 60);
    }

    function Run() {
        var bang = (counter >= 1.0);
        
        if (bang) {
            currentNote = scale.GetNote(Perlin.Fbm(position, 4) * 24);
            if (currentNote == prevNote) {
                bang = false;
            } else {
                prevNote = currentNote;
            }
            position += 0.1713;
            counter -= 1.0;
        }
        
        counter += delta;
        
        return bang;
    }
}
