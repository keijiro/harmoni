#pragma strict

@Range(0.0, 1.0)	var speed = 0.1;
@Range(0.0, 1.0)	var speedKeyAdd = 0.1;
@Range(0.0, 90.0)	var pitch = 0.0;
@Range(0.0, 5.0)	var amp = 1.0;
@Range(0.0, 5.0)	var ampKeyAdd = 1.0;
@Range(0.1, 5.0)	var freq = 1.0;

private var position = Vector3.zero;
private var keyParam = 0.0;
private var keyParamTarget = 0.0;
private var keyOffTime = 9999.9;

function KeyOn(target : float) {
	keyParamTarget = target;
	keyOffTime = 0.0;
}

function Update() {
	if (keyOffTime > 0.5) {
		keyParam = ExpEase.Out(keyParam, 0.0, -0.25);
	} else {
		keyParam = ExpEase.Out(keyParam, keyParamTarget, -0.25);
	}

	keyOffTime += Time.deltaTime;

	position += Vector3(Mathf.Cos(pitch), Mathf.Sin(pitch), 0.0) * (speed + speedKeyAdd * keyParam) * Time.deltaTime;

	renderer.material.SetVector("offs_u", position);
	renderer.material.SetVector("offs_v", position + Vector3.forward * 10);
	renderer.material.SetVector("offs_w", position + Vector3.forward * 20);
	renderer.material.SetVector("amp", Vector3.one * (amp + ampKeyAdd * keyParam));
	renderer.material.SetVector("freq", Vector3.one * freq);
}
