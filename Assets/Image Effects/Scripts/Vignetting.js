#pragma strict

@script ExecuteInEditMode
@script RequireComponent(Camera)
@script AddComponentMenu("Image Effects/Vignetting")

class Vignetting extends PostEffectsBase {
    @Range(0.0, 6.0) var vignetteIntensity = 0.375;
    @Range(0.0, 1.5) var blurAmount = 0.1;
    @Range(0.0, 4.0) var blurSpread = 1.5;
    @Range(0.0, 1.0) var noiseIntensity = 0.2;
    @Range(0.25, 1.5) var noiseScale = 1.0;

    @HideInInspector var shader : Shader;
    @HideInInspector var noiseTexture : Texture2D;

    private var material : Material;

    function CheckResources() {
        material = CheckShaderAndCreateMaterial(shader, material);
        return CheckSupport();
    }

    function OnRenderImage(source : RenderTexture, destination : RenderTexture) {
        if (!CheckResources()) {
            ReportAutoDisable();
            Graphics.Blit(source, destination);
            return;
        }

        var bdx = blurSpread * source.height / (512 * source.width);
        var bdy = blurSpread / 512;

        var uvmod = Vector4(
            Random.value,
            Random.value,
            noiseScale * Screen.width / noiseTexture.width,
            noiseScale * Screen.height / noiseTexture.height
        );

        var quarter1 = RenderTexture.GetTemporary(source.width / 4, source.height / 4, 0);
        var quarter2 = RenderTexture.GetTemporary(source.width / 4, source.height / 4, 0);

        Graphics.Blit(source, quarter1, material, 2);

        material.SetVector("offsets", Vector4(0, bdy, 0, 0));
        Graphics.Blit(quarter1, quarter2, material, 1);
        material.SetVector("offsets", Vector4(bdx, 0, 0, 0));
        Graphics.Blit(quarter2, quarter1, material, 1);

        material.SetTexture("blur_texture", quarter1);
        material.SetTexture("noise_texture", noiseTexture);
        material.SetVector("noise_uvmod", uvmod);
        material.SetFloat("vignette_intensity", vignetteIntensity);
        material.SetFloat("noise_intensity", noiseIntensity * Random.Range(0.9, 1.0));
        material.SetFloat("blur_amount", blurAmount);
        Graphics.Blit(source, destination, material, 0);
        
        RenderTexture.ReleaseTemporary(quarter1);    
        RenderTexture.ReleaseTemporary(quarter2);  
    }
}
