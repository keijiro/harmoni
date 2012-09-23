Shader "Hidden/Vignetting" {
	Properties {
		_MainTex ("Base", 2D) = "" {}
	}
	Subshader {
		// Downsampling pass
		Pass {
			Cull Off
			ZTest Off
			ZWrite Off
			Fog { Mode off }

			GLSLPROGRAM

			uniform sampler2D _MainTex;
			uniform vec2 _MainTex_TexelSize;
			varying lowp vec2 uv[4];

			#ifdef VERTEX
			void main() {
	            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
	            float dx = _MainTex_TexelSize.x;
	            float dy = _MainTex_TexelSize.y;
				uv[0] = gl_MultiTexCoord0.xy + vec2(-dx, -dy);
				uv[1] = gl_MultiTexCoord0.xy + vec2(-dx,  dy);
				uv[2] = gl_MultiTexCoord0.xy + vec2( dx, -dy);
				uv[3] = gl_MultiTexCoord0.xy + vec2( dx,  dy);
			}
			#endif

			#ifdef FRAGMENT
			void main() {
				gl_FragColor =
					0.25 * texture2D(_MainTex, uv[0]) +
					0.25 * texture2D(_MainTex, uv[1]) +
					0.25 * texture2D(_MainTex, uv[2]) +
					0.25 * texture2D(_MainTex, uv[3]);
			}
			#endif

			ENDGLSL
		}
		// Blur pass
		Pass {
			Cull Off
			ZTest Off
			ZWrite Off
			Fog { Mode off }

			GLSLPROGRAM

			uniform sampler2D _MainTex;
			uniform vec4 offsets;
			varying vec2 uv;
			varying vec4 delta[3];

			#ifdef VERTEX
			void main() {
	            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
				uv = gl_MultiTexCoord0.xy;
				delta[0] = gl_MultiTexCoord0.xyxy + offsets.xyxy * vec4(1, 1, -1, -1);
				delta[1] = gl_MultiTexCoord0.xyxy + offsets.xyxy * vec4(2, 2, -2, -2);
				delta[2] = gl_MultiTexCoord0.xyxy + offsets.xyxy * vec4(3, 3, -3, -3);
			}
			#endif

			#ifdef FRAGMENT
			void main() {
				gl_FragColor =
					0.4  * texture2D(_MainTex, uv) +
					0.15 * texture2D(_MainTex, delta[0].xy) +
					0.15 * texture2D(_MainTex, delta[0].zw) +
					0.1  * texture2D(_MainTex, delta[1].xy) +
					0.1  * texture2D(_MainTex, delta[1].zw) +
					0.05 * texture2D(_MainTex, delta[2].xy) +
					0.05 * texture2D(_MainTex, delta[2].zw);
			}
			#endif

			ENDGLSL
		}
		// Vignetting (heavy) pass
		Pass {
			Cull Off
			ZTest Off
			ZWrite Off
			Fog { Mode off }

			GLSLPROGRAM

			uniform sampler2D _MainTex;

			uniform sampler2D blur_texture;
			uniform sampler2D noise_texture;
			uniform sampler2D grad_texture;

			uniform vec4 noise_uvmod;
			uniform lowp float vignette_intensity;
			uniform lowp float noise_intensity;
			uniform lowp float blur_amount;

			varying lowp vec2 uv[2];

			#ifdef VERTEX
			void main() {
	            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
				uv[0] = gl_MultiTexCoord0.xy;
				uv[1] = gl_MultiTexCoord0.xy * noise_uvmod.zw + noise_uvmod.xy;
			}
			#endif

			#ifdef FRAGMENT
			void main() {
				lowp vec4 source = texture2D(_MainTex, uv[0]);
				lowp vec4 blur = texture2D(blur_texture, uv[0]);
				lowp float grad = texture2D(grad_texture, uv[0]).w;
				lowp float noise = texture2D(noise_texture, uv[1]).w;

				noise = (noise - 0.5) * noise_intensity;

				gl_FragColor =
					mix(source, blur, min(blur_amount * grad, 1.0)) * (1.0 - grad * vignette_intensity) +
					vec4(noise, noise, noise, noise);
			}
			#endif

			ENDGLSL
		}
		// Vignetting (light) pass
		Pass {
			Cull Off
			ZTest Off
			ZWrite Off
			Fog { Mode off }

			GLSLPROGRAM

			uniform sampler2D _MainTex;

			uniform sampler2D noise_texture;
			uniform sampler2D grad_texture;

			uniform vec4 noise_uvmod;
			uniform lowp float vignette_intensity;
			uniform lowp float noise_intensity;

			varying lowp vec2 uv[2];

			#ifdef VERTEX
			void main() {
	            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
				uv[0] = gl_MultiTexCoord0.xy;
				uv[1] = gl_MultiTexCoord0.xy * noise_uvmod.zw + noise_uvmod.xy;
			}
			#endif

			#ifdef FRAGMENT
			void main() {
				lowp vec4 source = texture2D(_MainTex, uv[0]);
				lowp float grad = texture2D(grad_texture, uv[0]).w;
				lowp float noise = texture2D(noise_texture, uv[1]).w;

				noise = (noise - 0.5) * noise_intensity;

				gl_FragColor =
					source * (1.0 - grad * vignette_intensity) +
					vec4(noise, noise, noise, noise);
			}
			#endif

			ENDGLSL
		}
	}
}
