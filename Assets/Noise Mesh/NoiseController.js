#pragma strict

@Range(0.0, 1.0)	var speed = 0.1;
@Range(0.0, 90.0)	var pitch = 0.0;
@Range(0.0, 5.0)	var amp = 1.0;
@Range(0.0, 1.0)	var vertical = 0.0;
@Range(0.1, 5.0)	var freq = 1.0;

private var base = Vector3(0, 10, 20);
private var position = Vector3.zero;

function Update() {
	position += Vector3(Mathf.Cos(pitch), Mathf.Sin(pitch), 0.0) * speed * Time.deltaTime;

	renderer.material.SetVector("offs_u", position + Vector3.forward * base[0]);
	renderer.material.SetVector("offs_v", position + Vector3.forward * base[1]);
	renderer.material.SetVector("offs_w", position + Vector3.forward * base[2]);
	renderer.material.SetVector("amp", Vector3(1.0 - vertical, 1.0 - vertical, 1.0) * amp);
	renderer.material.SetVector("freq", Vector3.one * freq);
}
