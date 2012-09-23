#pragma strict

private var target = Vector3.zero;

function Start() {
	target = transform.localPosition;
	transform.localPosition = Vector3.zero;

	while (transform.localPosition != target) {
		transform.localPosition = ExpEase.Out(transform.localPosition, target, -0.4);
		yield;
	}

	enabled = false;
}
