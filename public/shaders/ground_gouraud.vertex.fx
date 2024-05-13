#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// height displacement
uniform vec2 ground_size;
uniform float height_scalar;
uniform sampler2D heightmap;
// material
uniform float mat_shininess;
uniform vec2 texture_scale;
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
    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);
    vec3 normal = vec3(0.0, 1.0, 0.0); // no height displacement (temp)

    // Calculate illumination with vertex normal
    vec3 light_dir = normalize(light_positions[0] - position);
    diffuse_illum = light_colors[0] * max(0.0, dot(normal, light_dir));
    vec3 view_dir = normalize(camera_position - position);
    vec3 reflected_light = reflect(-light_dir, normal);
    specular_illum = light_colors[0] * pow(max(dot(reflected_light, view_dir), 0.0), mat_shininess);

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world_pos;
}
