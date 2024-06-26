#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// material
uniform vec2 texture_scale;
uniform float mat_shininess;
// camera
uniform vec3 camera_position;
// lights
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;

void main() {
    // Calculate illumination with vertex normal
    diffuse_illum = vec3(0.0, 0.0, 0.0);
    specular_illum = vec3(0.0, 0.0, 0.0);
    for (int l = 0; l < num_lights; l++) {
        vec3 light_dir = normalize(light_positions[l] - position);
        float diffuse_factor = max(0.0, dot(normal, light_dir));
        diffuse_illum += light_colors[l] * diffuse_factor;
        vec3 view_dir = normalize(camera_position - position);
        // Filter out back-face specular
        if (diffuse_factor > 0.0) {
            vec3 reflected_light = reflect(-light_dir, normal);
            specular_illum += light_colors[l] * pow(max(dot(reflected_light, view_dir), 0.0), mat_shininess);
        }
    }

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);
}
