Shader "Custom/Noise Wire" {
   Properties {
      _Color ("Color", Color) = (1, 1, 1, 1)
   }
   SubShader {
      Tags {"Queue" = "Geometry"}
      Pass {
         Cull Off

         GLSLPROGRAM
 
         uniform vec4 _Color;

         uniform vec3 freq;
         uniform vec3 amp;
         uniform vec3 offs_u;
         uniform vec3 offs_v;
         uniform vec3 offs_w;

         #ifdef VERTEX

         attribute vec4 Tangent;

         #include "classicnoise3D.glslinc"

         float fbm(vec3 coord) {
            return
               cnoise(coord      ) * 0.5 +
               cnoise(coord * 2.0) * 0.25 +
               cnoise(coord * 4.0) * 0.125 +
               cnoise(coord * 8.0) * 0.0625;
         }

         vec4 modify_vertex(vec4 src) {
         	vec3 crd = src.xyz * freq;
         	vec3 binormal = cross(gl_Normal, Tangent.xyz) * Tangent.w;
            src.xyz = src.xyz +
               Tangent.xyz * fbm(crd + offs_u) * amp.x +
               binormal    * fbm(crd + offs_v) * amp.y +
               gl_Normal   * fbm(crd + offs_w) * amp.z;
            return src;
         }
 
         void main() {
            gl_Position = gl_ModelViewProjectionMatrix * modify_vertex(gl_Vertex);
         }
 
         #endif
 
         #ifdef FRAGMENT
 
         void main() {
            gl_FragColor = _Color;
         }
 
         #endif
 
         ENDGLSL
      }
   }
}