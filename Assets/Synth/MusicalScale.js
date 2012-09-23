#pragma strict

class MusicalScale {
	static private var intervals0 = [0, 2, 3, 5, 7, 10]; // minor penta. + 4th
	static private var intervals1 = [0, 7];				 // 1th + 5th

	private var base = 0;
	private var octave_offset = 0;
	private var intervals = intervals0;

	function MusicalScale(aBase : int, aType : int) {
		octave_offset = aBase / 12;
		base = aBase % 12;
		if (aType) intervals = intervals1;
	}

	function GetNote(degree : int) {
		degree = Mathf.Max(0, degree + intervals.Length * octave_offset);
		return base + 12 * (degree / intervals.Length) + intervals[degree % intervals.Length];
	}
}
